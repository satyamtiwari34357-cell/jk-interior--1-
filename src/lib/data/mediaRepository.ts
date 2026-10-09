import { prisma } from "../prisma.ts";

export async function getAllMediaForAdmin(
  search?: string,
  sourceFilter?: string,
) {
  try {
    if (prisma) {
      const where: any = {};
      if (sourceFilter && sourceFilter !== "ALL") {
        where.source = sourceFilter;
      }
      if (search && search.trim() !== "") {
        const s = search.trim();
        where.OR = [
          { filename: { contains: s, mode: "insensitive" } },
          { alt: { contains: s, mode: "insensitive" } },
        ];
      }

      return await prisma.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (err) {
    console.warn("[Media] Admin fetch failed:", err);
  }

  return [];
}

export async function createMediaRecord(data: any) {
  if (!prisma) {
    return {
      id: `media-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  return await prisma.media.create({
    data: {
      url: data.url,
      secureUrl: data.secureUrl || data.url,
      publicId: data.publicId || null,
      filename: data.filename,
      originalFilename: data.originalFilename || null,
      alt: data.alt || "",
      width: data.width || 1600,
      height: data.height || 1066,
      format: data.format || "jpg",
      mimeType: data.mimeType || "image/jpeg",
      folder: data.folder || "jk-interior/media",
      source: data.source || "INSPIRATION",
      isConcept: data.isConcept === true || data.source !== "JK_INTERIOR",
    },
  });
}

export async function deleteMediaRecord(id: string) {
  if (!prisma) return true;
  return await prisma.media.delete({
    where: { id },
  });
}
