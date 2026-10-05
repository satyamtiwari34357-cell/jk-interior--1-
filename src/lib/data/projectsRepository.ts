import { prisma } from "../prisma.ts";

export interface PublicProject {
  id: string;
  title: string;
  slug: string;
  location: string;
  category: string;
  propertyType?: string | null;
  year?: string | null;
  area?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  concept?: string | null;
  scopeOfWork?: string | null;
  materials: string[];
  featured: boolean;
  isConcept: boolean;
  status: "DRAFT" | "PUBLISHED";
  images: Array<{
    id: string;
    url: string;
    alt?: string | null;
    caption?: string | null;
    isCover: boolean;
    sortOrder: number;
    source: string;
    isConcept: boolean;
  }>;
}

function toAspectRatio(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0)
    return value;
  if (typeof value !== "string") return null;

  const [width, height] = value.split(":").map(Number);
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  )
    return null;
  return Number((width / height).toFixed(2));
}

export const REAL_PUBLISHED_PROJECTS: PublicProject[] = [];

/**
 * Public Project Query Rule:
 * Strictly filter for status === 'PUBLISHED' and isConcept === false.
 */
export async function getPublishedProjects(): Promise<PublicProject[]> {
  try {
    if (prisma) {
      const records = await prisma.project.findMany({
        where: {
          status: "PUBLISHED",
          isConcept: false,
        },
        include: {
          images: {
            where: {
              source: "JK_INTERIOR",
              isConcept: false,
            },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      if (records && records.length > 0) {
        return records.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          location: p.location,
          category: p.category,
          propertyType: p.propertyType,
          year: p.year,
          area: p.area,
          shortDescription: p.shortDescription,
          fullDescription: p.fullDescription,
          concept: p.concept,
          scopeOfWork: p.scopeOfWork,
          materials: p.materials,
          featured: p.featured,
          isConcept: p.isConcept,
          status: p.status as "DRAFT" | "PUBLISHED",
          images: p.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            caption: img.caption,
            isCover: img.isCover,
            sortOrder: img.sortOrder,
            source: img.source,
            isConcept: img.isConcept,
          })),
        }));
      }
    }
  } catch (err) {
    console.warn("[Projects Repository] DB query skipped/failed:", err);
  }

  // Provide authentic published portfolio archive
  return REAL_PUBLISHED_PROJECTS;
}

export async function getProjectBySlug(
  slug: string,
): Promise<PublicProject | null> {
  try {
    if (prisma) {
      const p = await prisma.project.findFirst({
        where: {
          slug,
          status: "PUBLISHED",
          isConcept: false,
        },
        include: {
          images: {
            where: {
              source: "JK_INTERIOR",
              isConcept: false,
            },
            orderBy: { sortOrder: "asc" },
          },
        },
      });

      if (p) {
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          location: p.location,
          category: p.category,
          propertyType: p.propertyType,
          year: p.year,
          area: p.area,
          shortDescription: p.shortDescription,
          fullDescription: p.fullDescription,
          concept: p.concept,
          scopeOfWork: p.scopeOfWork,
          materials: p.materials,
          featured: p.featured,
          isConcept: p.isConcept,
          status: p.status as "DRAFT" | "PUBLISHED",
          images: p.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            caption: img.caption,
            isCover: img.isCover,
            sortOrder: img.sortOrder,
            source: img.source,
            isConcept: img.isConcept,
          })),
        };
      }
    }
  } catch (err) {
    console.warn("[Projects Repository] Find by slug skipped/failed:", err);
  }

  return null;
}

/**
 * Admin: Get all projects (including DRAFT and concept explorations)
 */
export async function getAllProjectsForAdmin(
  search?: string,
  category?: string,
  status?: string,
) {
  try {
    if (prisma) {
      const where: any = {};
      if (status && status !== "ALL") where.status = status;
      if (category && category !== "ALL") where.category = category;
      if (search && search.trim() !== "") {
        const s = search.trim();
        where.OR = [
          { title: { contains: s, mode: "insensitive" } },
          { location: { contains: s, mode: "insensitive" } },
          { slug: { contains: s, mode: "insensitive" } },
        ];
      }

      const list = await prisma.project.findMany({
        where,
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
      if (list && list.length > 0) return list;
    }
  } catch (err) {
    console.warn("[Projects Repository] Admin query skipped/failed:", err);
  }

  return [];
}

/**
 * Admin: Create Project
 */
export async function createProject(data: any) {
  if (!prisma) throw new Error("Database connection unavailable.");

  return await prisma.project.create({
    data: {
      title: data.title,
      slug: data.slug,
      location: data.location,
      category: data.category,
      propertyType: data.propertyType,
      year: data.year,
      area: data.area,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      concept: data.concept,
      scopeOfWork: data.scopeOfWork,
      materials: data.materials || [],
      featured: Boolean(data.featured),
      isConcept: Boolean(data.isConcept),
      status: data.status || "DRAFT",
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      images: {
        create: (data.images || []).map((img: any, idx: number) => ({
          url: img.url,
          secureUrl: img.secureUrl || img.url,
          publicId: img.publicId || "",
          filename: img.filename || `image-${idx + 1}`,
          alt: img.alt || data.title,
          caption: img.caption,
          width: img.width || 1600,
          height: img.height || 1200,
          format: img.format || "jpg",
          aspectRatio: toAspectRatio(img.aspectRatio) ?? 4 / 3,
          sortOrder: img.sortOrder ?? idx,
          isCover: Boolean(img.isCover),
          source: img.source || "JK_INTERIOR",
          isConcept: Boolean(img.isConcept),
        })),
      },
    },
    include: {
      images: true,
    },
  });
}

/**
 * Admin: Update Project
 */
export async function updateProject(id: string, data: any) {
  if (!prisma) throw new Error("Database connection unavailable.");

  // Clean existing images and replace with updated set
  if (data.images && Array.isArray(data.images)) {
    await prisma.projectImage.deleteMany({
      where: { projectId: id },
    });
  }

  return await prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      location: data.location,
      category: data.category,
      propertyType: data.propertyType,
      year: data.year,
      area: data.area,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      concept: data.concept,
      scopeOfWork: data.scopeOfWork,
      materials: data.materials || [],
      featured: Boolean(data.featured),
      isConcept: Boolean(data.isConcept),
      status: data.status,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      images: data.images
        ? {
            create: data.images.map((img: any, idx: number) => ({
              url: img.url,
              secureUrl: img.secureUrl || img.url,
              publicId: img.publicId || "",
              filename: img.filename || `image-${idx + 1}`,
              alt: img.alt || data.title,
              caption: img.caption,
              width: img.width || 1600,
              height: img.height || 1200,
              format: img.format || "jpg",
              aspectRatio: toAspectRatio(img.aspectRatio) ?? 4 / 3,
              sortOrder: img.sortOrder ?? idx,
              isCover: Boolean(img.isCover),
              source: img.source || "JK_INTERIOR",
              isConcept: Boolean(img.isConcept),
            })),
          }
        : undefined,
    },
    include: {
      images: true,
    },
  });
}

/**
 * Admin: Delete Project
 */
export async function deleteProject(id: string) {
  if (!prisma) throw new Error("Database connection unavailable.");
  return await prisma.project.delete({
    where: { id },
  });
}
