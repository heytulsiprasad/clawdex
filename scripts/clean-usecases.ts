import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-02-03",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || "",
});

async function clean() {
  const ids: string[] = await client.fetch('*[_type == "useCase"]._id');
  console.log(`Found ${ids.length} use cases to delete`);
  if (ids.length === 0) {
    console.log("Nothing to delete.");
    return;
  }

  // Batch deletes in groups of 50
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    const tx = client.transaction();
    for (const id of batch) tx.delete(id);
    await tx.commit();
    console.log(`  Deleted batch ${Math.floor(i / 50) + 1} (${batch.length} docs)`);
  }

  const remaining = await client.fetch('count(*[_type == "useCase"])');
  console.log(`\n✓ Cleanup complete. Remaining use cases: ${remaining}`);
}

clean().catch((e) => {
  console.error(e);
  process.exit(1);
});
