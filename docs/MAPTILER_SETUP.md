# MapTiler Setup Instructions

## Using MapTiler (Recommended)

MapTiler provides reliable maps with a generous free tier and better performance than Google Maps for most use cases.

### Getting Your MapTiler API Key

1. **Go to MapTiler Cloud**
   - Visit [MapTiler Cloud](https://cloud.maptiler.com/)
   - Sign up for a free account

2. **Create API Key**
   - Go to your account dashboard
   - Navigate to "API Keys"
   - Create a new key or use your default key
   - Copy the API key

3. **Configure in Story Swap**
   ```bash
   # In /frontend/vite-frontend/.env
   VITE_MAPTILER_API_KEY=your_maptiler_api_key_here
   ```

4. **Restart Development Server**
   ```bash
   cd frontend/vite-frontend
   npm run dev
   ```

### Your Current API Key
```
NSO8JuqWXOqh8UZs5tpY
```

This key is already configured in your `.env` file and should work immediately.

## MapTiler vs Google Maps

**MapTiler Advantages:**
- ✅ Better free tier (100,000 map loads/month)
- ✅ No credit card required for free tier
- ✅ Better performance and reliability
- ✅ Multiple map styles available
- ✅ Simpler setup process

**Google Maps (Fallback):**
- More familiar interface
- Street View integration
- Extensive POI data

## Troubleshooting

### Map Not Loading
1. **Check API Key**: Ensure `VITE_MAPTILER_API_KEY` is set in `.env`
2. **Check Console**: Look for errors in browser developer console
3. **Network Issues**: Verify internet connectivity
4. **Restart Server**: After changing `.env`, restart with `npm run dev`

### API Key Errors
- **Invalid Key**: Verify the key is copied correctly
- **Quota Exceeded**: Check your MapTiler dashboard for usage
- **Domain Restrictions**: Ensure localhost is allowed (default for new keys)

## Features Enabled

With MapTiler configured, you'll have:
- ✅ Interactive story location map
- ✅ Custom markers for each story
- ✅ Popup details when clicking markers
- ✅ Responsive map design
- ✅ Multiple map styles

## Map Styles Available

The current setup uses the "Streets" style, but MapTiler offers many options:
- Streets (current)
- Satellite
- Terrain
- OpenStreetMap
- Custom styles

To change the map style, edit `/src/components/MapTilerMap.tsx` and change:
```typescript
style: maptilersdk.MapStyle.STREETS
```

For more information, visit the [MapTiler Documentation](https://docs.maptiler.com/)