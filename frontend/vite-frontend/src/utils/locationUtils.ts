// Location utilities for mapping and geocoding

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

// Sample coordinates for demo purposes - in a real app, you'd use geocoding API
export const locationCoordinates: Record<string, LocationCoordinates> = {
  "Brooklyn, NY": { lat: 40.6782, lng: -73.9442 },
  "Austin, TX": { lat: 30.2672, lng: -97.7431 },
  "Lake Tahoe, CA": { lat: 39.0968, lng: -120.0324 },
  "San Francisco, CA": { lat: 37.7749, lng: -122.4194 },
  "Seattle, WA": { lat: 47.6062, lng: -122.3321 },
  "Portland, OR": { lat: 45.5152, lng: -122.6784 },
  "Denver, CO": { lat: 39.7392, lng: -104.9903 },
  "Nashville, TN": { lat: 36.1627, lng: -86.7816 },
  "Miami, FL": { lat: 25.7617, lng: -80.1918 },
  "Boston, MA": { lat: 42.3601, lng: -71.0589 },
};

export const getLocationCoordinates = (location: string): LocationCoordinates | null => {
  // Try exact match first
  if (locationCoordinates[location]) {
    return locationCoordinates[location];
  }

  // Try partial match (for cases like "Brooklyn" instead of "Brooklyn, NY")
  const partialMatch = Object.keys(locationCoordinates).find(key => 
    key.toLowerCase().includes(location.toLowerCase()) || 
    location.toLowerCase().includes(key.toLowerCase())
  );

  if (partialMatch) {
    return locationCoordinates[partialMatch];
  }

  return null;
};

export const formatLocationForDisplay = (location: string): string => {
  return location;
};

// Function to calculate center point for multiple locations
export const calculateCenter = (locations: LocationCoordinates[]): LocationCoordinates => {
  if (locations.length === 0) {
    return { lat: 39.8283, lng: -98.5795 }; // Center of US
  }

  if (locations.length === 1) {
    return locations[0];
  }

  const totalLat = locations.reduce((sum, loc) => sum + loc.lat, 0);
  const totalLng = locations.reduce((sum, loc) => sum + loc.lng, 0);

  return {
    lat: totalLat / locations.length,
    lng: totalLng / locations.length,
  };
};

// Function to calculate appropriate zoom level
export const calculateZoom = (locations: LocationCoordinates[]): number => {
  if (locations.length <= 1) {
    return 12;
  }

  const lats = locations.map(loc => loc.lat);
  const lngs = locations.map(loc => loc.lng);

  const latDiff = Math.max(...lats) - Math.min(...lats);
  const lngDiff = Math.max(...lngs) - Math.min(...lngs);

  const maxDiff = Math.max(latDiff, lngDiff);

  if (maxDiff > 10) return 4;
  if (maxDiff > 5) return 6;
  if (maxDiff > 2) return 8;
  if (maxDiff > 1) return 10;
  return 12;
};