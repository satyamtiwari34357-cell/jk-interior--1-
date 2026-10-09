import { v2 as cloudinary } from 'cloudinary';

// Server-side only Cloudinary configuration
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
}

export interface CloudinarySignatureResult {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  allowedFormats: string;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

/**
 * Generates a signed upload signature for Cloudinary.
 * Used exclusively by authenticated admins.
 */
export function generateUploadSignature(folder: string = 'jk-interior/projects'): CloudinarySignatureResult | null {
  if (!isCloudinaryConfigured() || !apiSecret || !apiKey || !cloudName) {
    return null;
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const allowedFormats = "jpg,png,webp,avif";
  const paramsToSign = {
    timestamp,
    folder,
    allowed_formats: allowedFormats,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    allowedFormats,
  };
}

/**
 * Safely destroys an asset in Cloudinary.
 */
export async function deleteCloudinaryAsset(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured()) return true;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok' || result.result === 'not found';
  } catch (err) {
    console.error('[Cloudinary] Failed to delete asset:', err);
    return false;
  }
}
