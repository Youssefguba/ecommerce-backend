#!/bin/bash

# Railway Deployment Test Script
# Usage: ./test_deployment.sh YOUR_RAILWAY_URL

if [ -z "$1" ]; then
    echo "❌ Please provide your Railway URL"
    echo "Usage: ./test_deployment.sh https://your-app-name.up.railway.app"
    exit 1
fi

URL=$1
echo "🧪 Testing deployment at: $URL"
echo ""

# Test 1: Health Check
echo "1️⃣ Testing health endpoint..."
HEALTH=$(curl -s "$URL/health")
if [[ $HEALTH == *"OK"* ]]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed: $HEALTH"
fi
echo ""

# Test 2: Products API
echo "2️⃣ Testing products endpoint..."
PRODUCTS=$(curl -s "$URL/api/products?limit=1")
if [[ $PRODUCTS == *"success"* ]]; then
    echo "✅ Products API working"
else
    echo "❌ Products API failed: $PRODUCTS"
fi
echo ""

# Test 3: Categories API
echo "3️⃣ Testing categories endpoint..."
CATEGORIES=$(curl -s "$URL/api/products/categories/all")
if [[ $CATEGORIES == *"Electronics"* ]]; then
    echo "✅ Categories API working - Sample data loaded"
else
    echo "❌ Categories API failed or no sample data: $CATEGORIES"
fi
echo ""

# Test 4: Login API
echo "4️⃣ Testing authentication..."
LOGIN=$(curl -s -X POST "$URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}')
if [[ $LOGIN == *"token"* ]]; then
    echo "✅ Authentication working - Test user exists"
else
    echo "❌ Authentication failed: $LOGIN"
fi
echo ""

echo "🎉 Deployment test completed!"
echo ""
echo "🔗 Your live API endpoints:"
echo "   • Health: $URL/health"
echo "   • Products: $URL/api/products"
echo "   • Auth: $URL/api/auth/login"
echo "   • Categories: $URL/api/products/categories/all"
echo ""
echo "🔐 Test credentials:"
echo "   • Admin: admin@example.com / admin123"
echo "   • User: test@example.com / test123"
