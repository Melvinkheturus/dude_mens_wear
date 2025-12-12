'use client';

import { CldImage } from 'next-cloudinary';
import { useState } from 'react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  crop?: 'fill' | 'fit' | 'scale' | 'auto';
  className?: string;
  priority?: boolean;
}

/**
 * Optimized Cloudinary Image Component
 * Automatically applies auto-format and auto-quality for optimized delivery
 */
export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  crop = 'fill',
  className = '',
  priority = false,
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <CldImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        crop={{
          type: crop,
          source: true,
        }}
        priority={priority}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  );
}
