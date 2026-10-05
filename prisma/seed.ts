import "dotenv/config";
import { PrismaClient } from "@prisma/client";

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

  // 2. Six Confirmed Services
  const confirmedServices = [
    {
      slug: "residential-interior-design",
      name: "Residential Interior Design",
      shortDescription:
        "Tailored architectural living environments crafted for contemporary Mumbai lifestyle and family sanctuaries.",
      description:
        "Comprehensive residential spatial planning, bespoke interior architecture, and tailored styling across penthouses, duplexes, and private estates.",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 1,
      published: true,
    },
    {
      slug: "commercial-interior-design",
      name: "Commercial Interior Design",
      shortDescription:
        "Sophisticated hospitality, boutique retail, and flagship interior experiences with high-traffic endurance.",
      description:
        "Brand-elevating commercial environments integrating acoustic zoning, bespoke millwork, and museum-grade architectural lighting.",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 2,
      published: true,
    },
    {
      slug: "office-design",
      name: "Office Design",
      shortDescription:
        "Private executive suites, wealth management chambers, and high-performance corporate boardrooms.",
      description:
        "High-security executive workspaces engineered with STC-50+ acoustic privacy, ergonomic custom millwork, and discrete automation.",
      image:
        "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 3,
      published: true,
    },
    {
      slug: "luxury-home-design",
      name: "Luxury Home Design",
      shortDescription:
        "Ultra-bespoke architectural retreats utilizing rare quarried stones, imported hardwoods, and artisan finishes.",
      description:
        "Exquisite multi-generational residences and coastal villas with specialized climate-sealed envelope detailing for Mumbai monsoons.",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 4,
      published: true,
    },
    {
      slug: "turnkey-interior",
      name: "Turnkey Interior",
      shortDescription:
        "Single-point execution accountability from bare concrete shell to key handover with zero subcontracting.",
      description:
        "Full-spectrum turnkey contracting: civil restructuring, MEP engineering, ceiling integration, marble bookmatching, and final snag audit.",
      image:
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 5,
      published: true,
    },
    {
      slug: "furniture-custom-furniture",
      name: "Furniture / Custom Furniture",
      shortDescription:
        "Millimeter-precision joinery, walk-in dressing suites, and custom statement centerpieces from our Mumbai atelier.",
      description:
        "Crafted in our 40,000 sq.ft Lower Parel workshop utilizing European CNC routers, dust-free lacquer booths, and seasoned hardwoods.",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 6,
      published: true,
    },
  ];

  for (const s of confirmedServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
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
