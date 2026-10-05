import { prisma } from "../prisma.ts";

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  sortOrder: number;
  published: boolean;
}

export const FALLBACK_CONFIRMED_SERVICES: ServiceItem[] = [];

export async function getPublishedServices(): Promise<ServiceItem[]> {
  try {
    if (prisma) {
      const records = await prisma.service.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      });
      if (records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          shortDescription: r.shortDescription || "",
          description: r.description || "",
          image: r.image || "",
          sortOrder: r.sortOrder,
          published: r.published,
        }));
      }
    }
  } catch (err) {
    console.warn("[Services Repository] DB query skipped/failed:", err);
  }

  return FALLBACK_CONFIRMED_SERVICES;
}

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceItem | null> {
  const all = await getPublishedServices();
  return all.find((s) => s.slug === slug) || null;
}
