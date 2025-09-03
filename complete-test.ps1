# IELTS API Complete Test Suite
Write-Host "IELTS Level Check API - Complete Test" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

$BASE_URL = "http://localhost:3000/api"
$headers = @{"Content-Type" = "application/json"}

# Test 1: Health Check
Write-Host ""
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BASE_URL/health" -Method Get -Headers $headers
    Write-Host "   SUCCESS: Health endpoint working" -ForegroundColor Green
    Write-Host "   Response: $($health | ConvertTo-Json -Compress)" -ForegroundColor Cyan
} catch {
    Write-Host "   FAILED: Health endpoint - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: API Root
Write-Host ""
Write-Host "2. Testing API Root..." -ForegroundColor Yellow
try {
    $root = Invoke-RestMethod -Uri $BASE_URL -Method Get -Headers $headers
    Write-Host "   SUCCESS: API Root working" -ForegroundColor Green
    Write-Host "   Response: $($root | ConvertTo-Json -Compress)" -ForegroundColor Cyan
} catch {
    Write-Host "   FAILED: API Root - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test Questions
Write-Host ""
Write-Host "3. Testing Test Questions..." -ForegroundColor Yellow
try {
    $questions = Invoke-RestMethod -Uri "$BASE_URL/tests/questions/listening" -Method Get -Headers $headers
    Write-Host "   SUCCESS: Listening questions ($($questions.Count) questions)" -ForegroundColor Green
    Write-Host "   First question: $($questions[0].question_text)" -ForegroundColor Cyan
} catch {
    Write-Host "   FAILED: Test questions - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Speaking Topics
Write-Host ""
Write-Host "4. Testing Speaking Topics..." -ForegroundColor Yellow
try {
    $topics = Invoke-RestMethod -Uri "$BASE_URL/tests/speaking/topics" -Method Get -Headers $headers
    Write-Host "   SUCCESS: Speaking topics ($($topics.Count) topics)" -ForegroundColor Green
    Write-Host "   First topic: $($topics[0].topic)" -ForegroundColor Cyan
} catch {
    Write-Host "   FAILED: Speaking topics - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Writing Prompts
Write-Host ""
Write-Host "5. Testing Writing Prompts..." -ForegroundColor Yellow
try {
    $prompts = Invoke-RestMethod -Uri "$BASE_URL/tests/writing/prompts" -Method Get -Headers $headers
    Write-Host "   SUCCESS: Writing prompts ($($prompts.Count) prompts)" -ForegroundColor Green
    Write-Host "   First prompt: $($prompts[0].prompt)" -ForegroundColor Cyan
} catch {
    Write-Host "   FAILED: Writing prompts - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Register User (Test AI functionality)
Write-Host ""
Write-Host "6. Testing User Registration..." -ForegroundColor Yellow
$registerData = @{
    email = "testuser@example.com"
    password = "password123"
    fullName = "Test User"
} | ConvertTo-Json

try {
    $register = Invoke-RestMethod -Uri "$BASE_URL/auth/register" -Method Post -Body $registerData -Headers $headers
    Write-Host "   SUCCESS: User registration working" -ForegroundColor Green
    Write-Host "   User created: $($register.user.fullName)" -ForegroundColor Cyan
    $global:testToken = $register.access_token
} catch {
    Write-Host "   INFO: User registration - $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   (User might already exist)" -ForegroundColor Yellow
}

# Test 7: Login User
Write-Host ""
Write-Host "7. Testing User Login..." -ForegroundColor Yellow
$loginData = @{
    email = "testuser@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -Body $loginData -Headers $headers
    Write-Host "   SUCCESS: User login working" -ForegroundColor Green
    $global:testToken = $login.access_token
    Write-Host "   Token received: $($login.access_token.Substring(0,20))..." -ForegroundColor Cyan
} catch {
    Write-Host "   FAILED: User login - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: AI Writing Evaluation (Real AI test)
if ($global:testToken) {
    Write-Host ""
    Write-Host "8. Testing AI Writing Evaluation..." -ForegroundColor Yellow
    $authHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $global:testToken"
    }
    
    $writingData = @{
        prompt = "Some people believe that technology has made our lives easier. Others think it has made our lives more complicated. Discuss both views and give your opinion."
        essay = "Technology has revolutionized our daily lives in numerous ways. While some people argue that it has simplified our existence, others contend that it has added unnecessary complexity. In my opinion, technology has predominantly made our lives easier, despite some challenges. On one hand, technology has streamlined many aspects of our lives. Communication has become instantaneous through smartphones and social media platforms. Tasks that once took hours can now be completed in minutes. For example, online banking allows us to manage finances without visiting physical branches. Additionally, access to information has never been easier, with search engines providing answers to virtually any question within seconds. On the other hand, the rapid pace of technological advancement can be overwhelming. Many people struggle to keep up with constant updates and new devices. Privacy concerns have also emerged as personal data becomes increasingly vulnerable to breaches. Furthermore, the digital divide means that not everyone has equal access to technological benefits. In conclusion, while technology does present certain challenges, its benefits far outweigh the drawbacks. The key is to embrace technological progress while being mindful of its potential pitfalls and working to address them proactively."
        timeSpent = 1800
    } | ConvertTo-Json
    
    try {
        $aiResult = Invoke-RestMethod -Uri "$BASE_URL/tests/submit/writing" -Method Post -Body $writingData -Headers $authHeaders
        Write-Host "   SUCCESS: AI Writing evaluation working!" -ForegroundColor Green
        Write-Host "   Overall Band Score: $($aiResult.overallBandScore)" -ForegroundColor Cyan
        Write-Host "   Task Achievement: $($aiResult.scores.taskAchievement)" -ForegroundColor Cyan
        Write-Host "   Coherence: $($aiResult.scores.coherenceCohesion)" -ForegroundColor Cyan
        Write-Host "   Lexical Resource: $($aiResult.scores.lexicalResource)" -ForegroundColor Cyan
        Write-Host "   Grammar: $($aiResult.scores.grammaticalRange)" -ForegroundColor Cyan
        Write-Host "   AI Feedback: $($aiResult.feedback.Substring(0,100))..." -ForegroundColor Cyan
    } catch {
        Write-Host "   FAILED: AI Writing evaluation - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "API Test Complete!" -ForegroundColor Green
Write-Host "Backend is ready for frontend integration!" -ForegroundColor Green
Write-Host "Swagger docs: http://localhost:3000/api/docs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
