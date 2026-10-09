import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { SERVICE_DATA } from "../src/data/customerExperience.ts";

const prisma = new PrismaClient();

async function main() {
  console.log("[Seed] Seeding JK Interior database foundation...");

  // Keep an existing settings record intact; only create the initial record once.
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        id: "default-settings",
        studioName: "JK Interior",
        founderName: "Kishorilal Sharma",
        serviceArea: "Mumbai",
      },
    });
  }

  for (const service of SERVICE_DATA) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        ...service,
        description: service.shortDescription,
        published: true,
      },
    });
  }

  console.log(
    "[Seed] Database seed completed successfully. No projects, testimonials, or leads were created.",
  );
}

main()
  .catch((e) => {
    console.error("[Seed] Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
