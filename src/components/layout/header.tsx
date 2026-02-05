"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Plus, LogIn, Bookmark, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/firebase/auth-context";

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/categories", label: "Categories" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, loading, isConfigured, signInWithGoogle, signOut } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="bg-white/80 backdrop-blur-xl border-b border-stone-200/80">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/icon-512.png"
              alt="ClawDex logo"
              width={28}
              height={28}
              className="rounded-md"
              priority
            />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
              Claw
              <span className="text-amber-600">Dex</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            {isConfigured && !loading && (
              <>
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white transition-all hover:border-stone-300 hover:shadow-sm"
                    >
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <User className="size-4 text-stone-600" />
                      )}
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-stone-200 bg-white py-1 shadow-lg">
                        <Link
                          href="/bookmarks"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-50"
                        >
                          <Bookmark className="size-4" />
                          My Bookmarks
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-50"
                        >
                          <LogOut className="size-4" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={signInWithGoogle}
                    className="flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-1.5 text-[13px] font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
                  >
                    <LogIn className="size-3.5" />
                    Sign in
                  </button>
                )}
              </>
            )}

            <Button
              asChild
              size="sm"
              className="h-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-[13px] hover:from-amber-600 hover:to-orange-600 shadow-sm transition-all hover:shadow-md"
            >
              <Link href="/submit">
                <Plus className="size-3.5" />
                Submit
              </Link>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-stone-200/60 px-4 pb-4 pt-2 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-stone-100 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-stone-200/60 space-y-2">
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600"
                >
                  <Link href="/submit" onClick={() => setMobileOpen(false)}>
                    <Plus className="size-3.5" />
                    Submit Use Case
                  </Link>
                </Button>

                {isConfigured && !loading && (
                  <>
                    {user ? (
                      <>
                        <Link
                          href="/bookmarks"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                        >
                          <Bookmark className="size-4" />
                          My Bookmarks
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setMobileOpen(false);
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                        >
                          <LogOut className="size-4" />
                          Sign out
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          signInWithGoogle();
                          setMobileOpen(false);
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                      >
                        <LogIn className="size-4" />
                        Sign in with Google
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
