// Environment configuration for Vite frontend
// All environment variables must be prefixed with VITE_ to be accessible in the client

export const config = {
  // Google Maps Configuration
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Story Swap',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Development flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Type-safe environment variable validation
export const validateEnvironment = () => {
  const requiredVars = {
    googleMapsApiKey: config.googleMapsApiKey,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingVars.join(', ')}.\n` +
      'Please check your .env file and ensure all required variables are set.\n' +
      'See docs/GOOGLE_MAPS_SETUP.md for setup instructions.'
    );
  }

  return missingVars.length === 0;
};

// Initialize validation on import
if (config.isDevelopment) {
  validateEnvironment();
}

export default config;