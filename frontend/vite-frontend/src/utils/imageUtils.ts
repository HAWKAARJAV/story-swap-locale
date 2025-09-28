// Image utilities and constants for the Story Swap application

// Local asset imports
import jazzClubImage from "@/assets/jazz-club.jpg";
import parisCafeImage from "@/assets/paris-cafe.jpg";
import communityFoodImage from "@/assets/community-food.jpg";

// Placeholder SVG data URI for reliable fallback
export const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTI1TDIwMCAxMjUiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHN2ZyB4PSIxNzAiIHk9IjEwMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjUwIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRTVFN0VCIiByeD0iNCIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjE1IiByPSI1IiBmaWxsPSIjOUNBM0FGIi8+Cjxwb2x5Z29uIHBvaW50cz0iMTAsNDAgNTAsNDAgNDUsMzAgMjUsMjAgMTUsMzAiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pgo8L3N2Zz4=";

// Avatar placeholder
export const avatarPlaceholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNOCAzMkM4IDI2LjQ3NzIgMTIuNDc3MiAyMiAxOCAyMlMyOCAyNi40NzcyIDI4IDMySDhaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg==";

// Map of reliable image sources
export const imageAssets = {
  jazzClub: jazzClubImage,
  parisCafe: parisCafeImage,
  communityFood: communityFoodImage,
};

// Array of high-quality, engaging demo images
export const demoImages = [
  imageAssets.jazzClub,
  imageAssets.parisCafe,
  imageAssets.communityFood,
  // Premium travel and cultural imagery
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=400&fit=crop&q=80", // Stunning beach scene
  "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=600&h=400&fit=crop&q=80", // Vibrant street market
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop&q=80", // Colorful cultural festival
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&h=400&fit=crop&q=80", // Dramatic architecture
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80", // Food culture
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop&q=80", // City skyline
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop&q=80", // Local tradition
];

// Get a demo image by index with fallback
export const getDemoImage = (index: number): string => {
  const imageIndex = index % demoImages.length;
  return demoImages[imageIndex];
};

// Enhanced image optimization utility
export const getOptimizedImageUrl = (url: string, options: {
  width?: number;
  height?: number;
  format?: 'webp' | 'jpg' | 'png';
  quality?: number;
  blur?: number;
} = {}): string => {
  // Default options for better quality
  const defaults = {
    width: 600,
    height: 400,
    format: 'webp' as const,
    quality: 85,
  };
  
  const opts = { ...defaults, ...options };
  
  // If it's a local asset, return as-is
  if (url.startsWith('/') || url.startsWith('data:')) {
    return url;
  }

  // If it's an Unsplash URL, we can optimize it
  if (url.includes('unsplash.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('w', opts.width.toString());
    urlObj.searchParams.set('h', opts.height.toString());
    urlObj.searchParams.set('fm', opts.format);
    urlObj.searchParams.set('q', opts.quality.toString());
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('crop', 'entropy'); // Better cropping algorithm
    if (opts.blur) urlObj.searchParams.set('blur', opts.blur.toString());
    return urlObj.toString();
  }

  return url;
};

// Story images with high-quality sources
export const storyImages = {
  brooklyn: imageAssets.jazzClub,
  austin: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&q=85",
  delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop&q=85",
  mumbai: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&h=400&fit=crop&q=85",
  tokyo: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&h=400&fit=crop&q=85",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop&q=85",
  tahoe: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&q=85",
  seattle: "https://images.unsplash.com/photo-1541360943-e87b5b2717b3?w=600&h=400&fit=crop&q=85",
  portland: imageAssets.parisCafe,
  miami: imageAssets.communityFood,
  denver: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
  nashville: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=250&fit=crop",
  boston: "https://images.unsplash.com/photo-1580674285531-12d7c0a4f8dc?w=400&h=250&fit=crop",
  sanfrancisco: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop",
};

// Fallback image handler
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.src !== placeholderImage) {
    img.src = placeholderImage;
  }
};

export default {
  placeholderImage,
  avatarPlaceholder,
  imageAssets,
  demoImages,
  getDemoImage,
  getOptimizedImageUrl,
  storyImages,
  handleImageError,
};