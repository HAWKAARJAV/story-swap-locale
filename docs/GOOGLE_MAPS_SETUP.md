# Google Maps Setup Instructions

## Getting Your Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click on the project dropdown at the top
   - Either select an existing project or create a new one

3. **Enable the Maps JavaScript API**
   - Go to "APIs & Services" > "Library"
   - Search for "Maps JavaScript API"
   - Click on it and press "Enable"

4. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

5. **Secure Your API Key (Recommended)**
   - Click on your API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:8080/*` for development)
   - Under "API restrictions", select "Restrict key"
   - Choose "Maps JavaScript API"

## Setting Up in Story Swap

1. **Update Environment Variables**
   ```bash
   # In /frontend/vite-frontend/.env
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

2. **Restart the Development Server**
   ```bash
   cd frontend/vite-frontend
   npm run dev
   ```

3. **Verify Setup**
   - The Google Maps integration will be available in the app
   - Check the browser console for any API key errors

## Security Notes

- **Never commit your API key to version control**
- The `.env` file is already in `.gitignore`
- For production, use environment variables on your hosting platform
- Consider setting up billing alerts in Google Cloud Console

## Troubleshooting

- **"RefererNotAllowedMapError"**: Check your HTTP referrer restrictions
- **"ApiNotActivatedMapError"**: Enable the Maps JavaScript API
- **"InvalidKeyMapError"**: Verify your API key is correct
- **Console warnings**: Check the environment configuration

For more information, visit the [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)