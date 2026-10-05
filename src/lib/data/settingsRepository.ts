import { prisma } from "../prisma.ts";

export async function getSiteSettings() {
  const defaultSettings = {
    id: "default-settings",
    studioName: "JK Interior",
    founderName: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    serviceArea: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    logoUrl: "",
    faviconUrl: "",
    seoTitle: "JK Interior",
    seoDescription: "Interior design studio profile.",
  };

  try {
    if (prisma) {
      const record = await prisma.siteSettings.findFirst();
      if (record) return record;
    }
  } catch (err) {
    console.warn("[SiteSettings] DB query skipped/failed:", err);
  }

  return defaultSettings;
}

export async function updateSiteSettings(data: any) {
  if (!prisma) {
    return { ...data, updatedAt: new Date() };
  }

  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    return await prisma.siteSettings.update({
      where: { id: existing.id },
      data,
    });
  } else {
    return await prisma.siteSettings.create({
      data,
    });
  }
}
