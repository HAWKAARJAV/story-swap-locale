import { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { config } from '@/config/environment';

interface MapProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    content?: string;
  }>;
  className?: string;
}

const MapComponent = ({ center, zoom, markers = [], className = "" }: MapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach(markerData => {
        const marker = new window.google.maps.Marker({
          position: markerData.position,
          map,
          title: markerData.title,
        });

        if (markerData.content) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: markerData.content,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }
      });
    }
  }, [map, markers]);

  return <div ref={ref} className={`w-full h-full ${className}`} />;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full text-center p-4">
          <div className="text-muted-foreground">
            <p className="font-medium">Map failed to load</p>
            <p className="text-sm mt-1">
              Please check your Google Maps API key configuration
            </p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

interface GoogleMapProps extends MapProps {
  apiKey?: string;
}

const GoogleMap = ({ apiKey = config.googleMapsApiKey, ...mapProps }: GoogleMapProps) => {
  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
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
            To enable the interactive map, you'll need to add a Google Maps API key.
          </p>
          <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded-lg">
            <strong>Setup Instructions:</strong><br/>
            1. Get a Google Maps API key<br/>
            2. Add it to your .env file<br/>
            3. See docs/GOOGLE_MAPS_SETUP.md for details
          </div>
        </div>
      </div>
    );
  }

  return (
    <Wrapper apiKey={apiKey} render={render}>
      <MapComponent {...mapProps} />
    </Wrapper>
  );
};

export default GoogleMap;