#!/bin/bash

echo "🧪 IELTS Level Check API Test Suite"
echo "===================================="

# API Base URL
BASE_URL="http://localhost:3000/api"

echo ""
echo "📊 1. Testing API Health..."
curl -s "$BASE_URL" | jq '.'

echo ""
echo "🏥 2. Testing Health Endpoint..."
curl -s "$BASE_URL/health" | jq '.'

echo ""
echo "🔐 3. Testing Auth Endpoints..."
echo "3.1 Register endpoint:"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}' | jq '.'

echo ""
echo "3.2 Login endpoint:"
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq '.'

echo ""
echo "📝 4. Testing Tests Endpoints..."
echo "4.1 Get test questions for LISTENING:"
curl -s "$BASE_URL/tests/questions/LISTENING" | jq '.'

echo ""
echo "4.2 Get writing prompts:"
curl -s "$BASE_URL/tests/writing/prompts" | jq '.'

echo ""
echo "4.3 Get speaking topics:"
curl -s "$BASE_URL/tests/speaking/topics" | jq '.'

echo ""
echo "🏆 5. Testing Results Endpoints..."
echo "5.1 Get global stats:"
curl -s "$BASE_URL/results/global/stats" | jq '.'

echo ""
echo "✅ API Test Suite Complete!"
echo "📚 Full API Documentation: http://localhost:3000/api/docs"
