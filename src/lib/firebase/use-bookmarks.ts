"use client";

import { useAuth } from "./auth-context";
import { db } from "./config";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useState, useEffect, useCallback } from "react";

interface BookmarkDocument {
  useCaseId: string;
  title: string;
  createdAt: ReturnType<typeof serverTimestamp>;
}

interface UseBookmarksReturn {
  bookmarks: Set<string>;
  toggleBookmark: (id: string, title: string) => Promise<void>;
  isBookmarked: (id: string) => boolean;
  loading: boolean;
}

export function useBookmarks(): UseBookmarksReturn {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setBookmarks(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);
    const bookmarksRef = collection(db, "users", user.uid, "bookmarks");

    const unsubscribe = onSnapshot(
      bookmarksRef,
      (snapshot) => {
        const bookmarkIds = new Set<string>();
        snapshot.forEach((doc) => {
          const data = doc.data() as BookmarkDocument;
          bookmarkIds.add(data.useCaseId);
        });
        setBookmarks(bookmarkIds);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to bookmarks:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const toggleBookmark = useCallback(
    async (id: string, title: string) => {
      if (!user?.uid) {
        throw new Error("You must be signed in to bookmark use cases");
      }

      const bookmarkRef = doc(db, "users", user.uid, "bookmarks", id);

      if (bookmarks.has(id)) {
        await deleteDoc(bookmarkRef);
      } else {
        const bookmarkData: BookmarkDocument = {
          useCaseId: id,
          title,
          createdAt: serverTimestamp(),
        };
        await setDoc(bookmarkRef, bookmarkData);
      }
    },
    [user?.uid, bookmarks]
  );

  const isBookmarked = useCallback(
    (id: string) => {
      return bookmarks.has(id);
    },
    [bookmarks]
  );

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    loading,
  };
}
