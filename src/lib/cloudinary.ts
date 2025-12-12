// Cloudinary configuration and utilities
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dy98erjph',
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '785257572439362',
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

/**
 * Get optimized Cloudinary image URL
 * @param publicId - Cloudinary public ID
 * @param options - Transformation options
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  }
) {
  const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options || {};
  
  const transformations = [
    `f_${format}`,
    `q_${quality}`,
    width && `w_${width}`,
    height && `h_${height}`,
    crop && `c_${crop}`,
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformations}/${publicId}`;
}

/**
 * Product image presets for consistent sizing
 */
export const imagePresets = {
  thumbnail: { width: 150, height: 150, crop: 'fill' },
  card: { width: 400, height: 400, crop: 'fill' },
  detail: { width: 800, height: 800, crop: 'fill' },
  hero: { width: 1200, height: 600, crop: 'fill' },
  full: { width: 1920, height: 1080, crop: 'limit' },
};
