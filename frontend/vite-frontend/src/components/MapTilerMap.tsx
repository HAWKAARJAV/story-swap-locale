import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { config } from '@/config/environment';

interface MapTilerMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    content?: string;
  }>;
  className?: string;
}

const MapTilerMap = ({ center, zoom, markers = [], className = "" }: MapTilerMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!config.maptilerApiKey) {
      console.warn('MapTiler API key is not configured');
      return;
    }

    if (map.current) return; // Map already initialized

    maptilersdk.config.apiKey = config.maptilerApiKey;

    if (mapContainer.current) {
      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [center.lng, center.lat],
        zoom: zoom,
      });

      map.current.on('load', () => {
        setMapLoaded(true);
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center.lat, center.lng, zoom]);

  // Add markers when map is loaded
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.maplibregl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add new markers
    markers.forEach(markerData => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = '#3b82f6';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      const marker = new maptilersdk.Marker({ element: el })
        .setLngLat([markerData.position.lng, markerData.position.lat])
        .addTo(map.current!);

      if (markerData.content) {
        const popup = new maptilersdk.Popup({ offset: 25 })
          .setHTML(markerData.content);

        marker.setPopup(popup);
      }
    });
  }, [markers, mapLoaded]);

  // Handle center and zoom changes
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.flyTo({
        center: [center.lng, center.lat],
        zoom: zoom,
        essential: true
      });
    }
  }, [center.lat, center.lng, zoom, mapLoaded]);

  if (!config.maptilerApiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center p-8 border-2 border-dashed border-blue-200">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Interactive Map Coming Soon</h3>
          <p className="text-sm text-gray-600 mb-4">
            MapTiler API key is configured and map should load.
          </p>
          <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded-lg">
            <strong>If map doesn't appear:</strong><br/>
            1. Check browser console for errors<br/>
            2. Verify API key is valid<br/>
            3. Check network connectivity
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
};

export default MapTilerMap;