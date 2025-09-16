import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

// Format number with K/M suffixes
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
}

// Calculate reading time based on word count
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Generate story summary from content
export function generateSummary(content: string, maxLength: number = 150): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim());
  let summary = '';
  
  for (const sentence of sentences) {
    if (summary.length + sentence.length > maxLength) break;
    summary += sentence.trim() + '. ';
  }
  
  return summary.trim() || content.substring(0, maxLength) + '...';
}

// Get city theme configuration
export function getCityTheme(city: string): {
  gradient: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
} {
  const themes: Record<string, any> = {
    delhi: {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      accentColor: '#9f7aea',
    },
    mumbai: {
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      primaryColor: '#f093fb',
      secondaryColor: '#f5576c',
      accentColor: '#ff6b9d',
    },
    chennai: {
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      primaryColor: '#4facfe',
      secondaryColor: '#00f2fe',
      accentColor: '#06b6d4',
    },
    jaipur: {
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      primaryColor: '#fa709a',
      secondaryColor: '#fee140',
      accentColor: '#f59e0b',
    },
    agra: {
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      primaryColor: '#a8edea',
      secondaryColor: '#fed6e3',
      accentColor: '#34d399',
    },
  };

  return themes[city.toLowerCase()] || themes.delhi;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Format distance with appropriate units
export function formatDistance(distance: number): string {
  if (distance < 1) return `${Math.round(distance * 1000)}m`;
  if (distance < 10) return `${distance.toFixed(1)}km`;
  return `${Math.round(distance)}km`;
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

// Local storage utilities
export const storage = {
  get: (key: string): any => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
};

// Color utility functions
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Generate random gradient colors
export function generateRandomGradient(): string {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
    '#fa709a', '#fee140', '#a8edea', '#fed6e3', '#84fab0', '#8fd3f4',
    '#d299c2', '#fef9d7', '#89f7fe', '#66a6ff'
  ];
  
  const color1 = colors[Math.floor(Math.random() * colors.length)];
  const color2 = colors[Math.floor(Math.random() * colors.length)];
  
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}

// URL and slug utilities
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

// File utilities
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

// Array utilities
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function chunk<T>(array: T[], size: number): T[][] {
  return array.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!chunks[chunkIndex]) chunks[chunkIndex] = [];
    chunks[chunkIndex].push(item);
    return chunks;
  }, [] as T[][]);
}

// Animation utilities
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

// Cookie utilities
export const cookies = {
  get: (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  },
  
  set: (name: string, value: string, days: number = 30): void => {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  },
  
  remove: (name: string): void => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

// Environment utilities
export const env = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isClient: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',
};

// Analytics event tracking
export function trackEvent(eventName: string, properties?: Record<string, any>): void {
  // This would integrate with your analytics service
  if (env.isDevelopment) {
    console.log('📊 Event tracked:', eventName, properties);
  }
  
  // Example: gtag, mixpanel, amplitude, etc.
  // gtag('event', eventName, properties);
}