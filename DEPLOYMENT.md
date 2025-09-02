# 🚀 IELTS Level Check - Deployment Guide

## Serverga Joylashtirish Qo'llanmasi

### 1. RAILWAY (Tavsiya etiladi - Eng oson)

1. **Railway hisobini oching:** https://railway.app
2. **GitHub bilan ulanish**
3. **New Project > Deploy from GitHub repo**
4. **Repositoryingizni tanlang**
5. **Environment Variables qo'shish:**
   ```env
   DATABASE_URL=postgresql://username:password@host:5432/database_name
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
   NODE_ENV=production
   CORS_ORIGINS=https://your-frontend-domain.com
   ```
6. **Deploy!** - Avtomatik deploy qiladi

### 2. VERCEL (Frontend bilan birga)

1. **Vercel CLI o'rnatish:**
   ```bash
   npm i -g vercel
   ```
2. **Login:**
   ```bash
   vercel login
   ```
3. **Deploy:**
   ```bash
   vercel --prod
   ```
4. **Environment Variables Vercel dashboard'da qo'shing**

### 3. HEROKU

1. **Heroku CLI o'rnatish**
2. **App yaratish:**
   ```bash
   heroku create your-app-name
   ```
3. **Database qo'shish:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```
4. **Environment Variables:**
   ```bash
   heroku config:set JWT_SECRET=your-secret
   heroku config:set NODE_ENV=production
   ```
5. **Deploy:**
   ```bash
   git push heroku main
   ```

### 4. DOCKER (Universal)

1. **Build Docker image:**
   ```bash
   docker build -t ielts-api .
   ```
2. **Run container:**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="your-db-url" \
     -e JWT_SECRET="your-secret" \
     -e NODE_ENV="production" \
     ielts-api
   ```

### 5. VPS (Ubuntu/CentOS)

1. **Node.js o'rnatish:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
2. **PM2 o'rnatish:**
   ```bash
   npm install -g pm2
   ```
3. **Loyihani yuklash va o'rnatish:**
   ```bash
   git clone your-repo-url
   cd ielts-level-check
   npm install
   npm run build
   ```
4. **PM2 bilan ishga tushirish:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 startup
   pm2 save
   ```

## Environment Variables (Majburiy)

```env
# Database (Required)
DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public"

# JWT (Required)
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters"
JWT_EXPIRES_IN="24h"

# App Configuration
PORT=3000
NODE_ENV="production"

# CORS (Frontend URL'laringiz)
CORS_ORIGINS="https://your-frontend-domain.com,https://another-domain.com"

# Optional
OPENAI_API_KEY="sk-your-openai-api-key-here"
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100
```

## Database Migration

Deployment'dan keyin birinchi marta:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## SSL Sertifikat

Bepul SSL uchun Cloudflare yoki deployment platformasining SSL'idan foydalaning.

## Monitoring

- Railway: Built-in monitoring
- Vercel: Analytics dashboard
- Heroku: Heroku Metrics
- Custom VPS: PM2 monitoring

## Backup

Database'ni kunlik backup qiling:

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

## Performance Tips

1. **Production mode'da ishlating**
2. **Swagger'ni disable qiling (production'da)**
3. **Rate limiting sozlang**
4. **Log level'ni "error" ga o'rnating**
5. **CDN ishlatib static file'lar uchun**

## Troubleshooting

- **Database connection error:** DATABASE_URL to'g'ri ekanligini tekshiring
- **JWT error:** JWT_SECRET uzunligini tekshiring (32+ characters)
- **CORS error:** CORS_ORIGINS'da frontend URL'ingizni qo'shing
- **Port error:** PORT environment variable to'g'ri o'rnatilgan

## Post-Deployment Checklist

- [ ] API health check ishlaydimi? `/api/health`
- [ ] Database connection ishlaydimi?
- [ ] Authentication ishlaydimi?
- [ ] Test endpoints ishlaydimi?
- [ ] CORS sozlangan?
- [ ] SSL sertifikat faol?
- [ ] Monitoring sozlangan?
- [ ] Backup sozlangan?

**Loyiha production'da ishga tayyor! 🎉**
