#!/bin/bash

echo "🚀 Starting automatic deployment to Netlify..."
echo

echo "📦 Step 1: Installing dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "🔨 Step 2: Building React app..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "📤 Step 3: Deploying to Netlify..."
cd ..
netlify deploy --prod --dir=client/build
if [ $? -ne 0 ]; then
    echo "❌ Deploy failed"
    exit 1
fi

echo "✅ Deployment successful!"
echo "🌐 Your app is now live on Netlify"