import { config } from '@/config/environment';
import MapTilerMap from './MapTilerMap';

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

const Map = (props: MapProps) => {
  // Use MapTiler if API key is available
  if (config.maptilerApiKey && config.maptilerApiKey !== 'your_maptiler_api_key_here') {
    return <MapTilerMap {...props} />;
  }

  // No API keys available
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg text-center p-8 border-2 border-dashed border-gray-200">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">Interactive Map</h3>
        <p className="text-sm text-gray-600 mb-4">
          Configure MapTiler or Google Maps API key to enable the interactive map.
        </p>
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>Setup:</strong> Add VITE_MAPTILER_API_KEY to your .env file
        </div>
      </div>
    </div>
  );
};

export default Map;