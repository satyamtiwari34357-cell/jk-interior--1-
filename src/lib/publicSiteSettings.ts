import { useEffect, useState } from "react";

export interface PublicSiteSettings {
  studioName: string;
  founderName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  serviceArea: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
}

const emptySettings: PublicSiteSettings = {
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
};

let settingsRequest: Promise<PublicSiteSettings> | undefined;

async function loadPublicSiteSettings(): Promise<PublicSiteSettings> {
  const response = await fetch("/api/settings");
  if (!response.ok) throw new Error("Public site settings unavailable");
  const payload = (await response.json()) as { settings?: Partial<PublicSiteSettings> };
  const values = payload.settings;
  return {
    studioName: values?.studioName || emptySettings.studioName,
    founderName: values?.founderName || "",
    phone: values?.phone || "",
    whatsapp: values?.whatsapp || "",
    email: values?.email || "",
    address: values?.address || "",
    serviceArea: values?.serviceArea || "",
    instagram: values?.instagram || "",
    facebook: values?.facebook || "",
    linkedin: values?.linkedin || "",
    youtube: values?.youtube || "",
  };
}

export function usePublicSiteSettings(): PublicSiteSettings {
  const [settings, setSettings] = useState(emptySettings);

  useEffect(() => {
    let active = true;
    settingsRequest ??= loadPublicSiteSettings();
    settingsRequest.then(setSettings).catch(() => {
      if (active) setSettings(emptySettings);
    });
    return () => {
      active = false;
    };
  }, []);

  return settings;
}

export function phoneHref(value: string): string | null {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  const normalized = trimmed.startsWith("+") ? `+${digits}` : digits;
  return normalized.length >= 7 ? `tel:${normalized}` : null;
}

export function whatsappHref(value: string, message: string): string | null {
  const normalized = value.replace(/\D/g, "");
  return normalized.length >= 8
    ? `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
    : null;
}
