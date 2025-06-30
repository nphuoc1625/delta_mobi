#!/bin/bash

# Setup environment files for DeltaMobi project
echo "🚀 Setting up environment files for DeltaMobi..."

# Check if .env.development already exists
if [ -f ".env.development" ]; then
    echo "⚠️  .env.development already exists. Skipping..."
else
    echo "📝 Creating .env.development..."
    cp env.development.example .env.development
    echo "✅ .env.development created"
fi

# Check if .env.staging already exists
if [ -f ".env.staging" ]; then
    echo "⚠️  .env.staging already exists. Skipping..."
else
    echo "📝 Creating .env.staging..."
    cp env.staging.example .env.staging
    echo "✅ .env.staging created"
fi

# Check if .env.production already exists
if [ -f ".env.production" ]; then
    echo "⚠️  .env.production already exists. Skipping..."
else
    echo "📝 Creating .env.production..."
    cp env.production.example .env.production
    echo "✅ .env.production created"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Update the MONGODB_URI in each .env file with your actual credentials"
echo "2. Replace 'username:password' with your MongoDB Atlas credentials"
echo "3. The database names will be automatically set based on environment"
echo ""
echo "📊 Your databases will be:"
echo "   - Development: delta_mobi_dev"
echo "   - Staging: delta_mobi_staging"
echo "   - Production: delta_mobi_prod"
echo ""
echo "🔗 Example connection string format:"
echo "   MONGODB_URI=mongodb+srv://your_username:your_password@deltamobi.nm1zji6.mongodb.net/?retryWrites=true&w=majority&appName=deltamobi" 