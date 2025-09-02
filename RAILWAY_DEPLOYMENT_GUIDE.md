# Railway Deployment Guide - IELTS Level Check API

## 1-qadam: GitHub repositoryga push qiling

```bash
# GitHub repository yarating: https://github.com/new
# Repositoryni qo'shing:
git remote add origin https://github.com/YOUR_USERNAME/ielts-level-check.git
git branch -M main
git push -u origin main
```

## 2-qadam: Railway'da loyiha yarating

1. https://railway.app ga o'ting
2. GitHub bilan kirish
3. "New Project" tugmasini bosing
4. "Deploy from GitHub repo" ni tanlang
5. `ielts-level-check` repositoryni tanlang

## 3-qadam: PostgreSQL qo'shing

Railway dashboard'da:

1. "Add service" → "Database" → "PostgreSQL"
2. Avtomatik yaratiladi va `DATABASE_URL` o'zgaruvchisi qo'shiladi

## 4-qadam: Environment Variables qo'shing

Railway dashboard Settings → Variables bo'limida:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
CORS_ORIGINS=https://your-frontend-domain.com
PORT=3000
```

## 5-qadam: Deploy Settings

Railway avtomatik aniqlaydi:

- **Build Command**: `npm run build`
- **Start Command**: `npm run start:prod`
- **Port**: 3000

## 6-qadam: Database Migration

Deploy bo'lgandan keyin Railway terminalda:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## 7-qadam: Health Check

Deploy tugagach:

- API URL: `https://your-app.railway.app`
- Health check: `GET /health`
- Swagger docs: `GET /api/docs`

## Muhim eslatmalar:

✅ **Railway.json** fayli mavjud - avtomatik konfiguratsiya  
✅ **Dockerfile** mavjud - containerization  
✅ **package.json** start scriptlari tayyor  
✅ **Prisma** migration va seed fayllar tayyor  
✅ **Environment** o'zgaruvchilar sozlangan

## Deployment URL:

Deploy tugagach sizga Railway link beradi:
`https://ielts-level-check-production.up.railway.app`

## API Endpoints:

- POST /auth/register - Ro'yxatdan o'tish
- POST /auth/login - Kirish
- GET /tests - Testlar ro'yxati
- POST /tests/submit - Test topshirish
- GET /results/my - Natijalarim
- GET /api/docs - Swagger documentation

## Xavfsizlik:

- Rate limiting: 100 requests per 15 minutes
- JWT authentication
- CORS protection
- Global exception handling
- Input validation with class-validator

Loyihangiz production ready! 🚀
