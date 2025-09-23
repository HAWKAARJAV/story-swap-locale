#!/bin/bash

echo "🌱 Seeding Story Swap Database..."
echo "================================"

cd "$(dirname "$0")/backend"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb-community@7.0"
    exit 1
fi

echo "🗄️  Connecting to database..."
echo "📊 Running seed script..."

# Run the seed script
node scripts/seedData.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database seeded successfully!"
    echo ""
    echo "🔐 Admin credentials created:"
    echo "   Email: admin@example.com"
    echo "   Password: test1234"
    echo ""
    echo "👥 User accounts created:"
    echo "   Rita: rita@example.com / test1234"
    echo "   Sam: sam@example.com / test1234"
    echo ""
    echo "📚 Sample stories added with locations"
    echo "🗺️  Ready for MapTiler integration testing"
else
    echo "❌ Database seeding failed. Check the error messages above."
    exit 1
fi