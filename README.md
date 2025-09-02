# IELTS Level Check Backend API

🎯 **IELTS darajasini tekshirish uchun to'liq backend API**

NestJS, PostgreSQL, Prisma ORM va Swagger bilan qurilgan zamonaviy IELTS baholash tizimi.

## 🛠️ Texnologik Stack

- **Backend Framework**: NestJS 11
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Passport
- **API Documentation**: Swagger/OpenAPI
- **AI Integration**: OpenAI GPT-4o-mini
- **Validation**: class-validator, class-transformer
- **Rate Limiting**: @nestjs/throttler

## 🏗️ Loyiha Strukturasi

```
src/
├── config/                 # Database konfiguratsiyasi
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── modules/
│   ├── auth/              # Autentifikatsiya
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── users/             # Foydalanuvchilar boshqaruvi
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── tests/             # IELTS testlari
│   │   ├── dto/
│   │   ├── tests.controller.ts
│   │   ├── tests.module.ts
│   │   └── tests.service.ts
│   ├── results/           # Test natijalari
│   │   ├── results.controller.ts
│   │   ├── results.module.ts
│   │   └── results.service.ts
│   └── openai/            # AI integration
│       ├── openai.module.ts
│       └── openai.service.ts
├── app.module.ts
└── main.ts
```

## 🎯 IELTS Test Modullari

### 1. **Listening Test** 🎧
- Audio fayllari bilan ishlash
- Ko'p variant javoblar
- Qisqa javoblar
- Rule-based scoring

### 2. **Reading Test** 📖
- Passage reading
- True/False/Not Given
- Multiple choice
- Short answers
- Rule-based scoring

### 3. **Writing Test** ✍️
- Task 1: Data description, charts, graphs
- Task 2: Essay writing
- AI-powered evaluation (OpenAI GPT-4o-mini)
- Detailed criteria scoring:
  - Task Response
  - Coherence & Cohesion
  - Lexical Resource
  - Grammatical Range & Accuracy

### 4. **Speaking Test** 🗣️
- Part 1: Introduction & Interview
- Part 2: Individual long turn
- Part 3: Two-way discussion
- AI-powered evaluation:
  - Fluency & Coherence
  - Lexical Resource
  - Grammatical Range & Accuracy
  - Pronunciation

## 🏃‍♂️ Loyihani Ishga Tushirish

### 1. Repository clone qilish
```bash
git clone <repository-url>
cd ielts-level-check
```

### 2. Dependencies o'rnatish
```bash
npm install
```

### 3. Environment variables sozlash
```bash
cp .env.example .env
```

`.env` faylida quyidagi o'zgaruvchilarni to'ldiring:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ielts_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key-here"

# App Configuration
PORT=3000
NODE_ENV=development
```

### 4. Database sozlash
```bash
# PostgreSQL server ishga tushiring
# Database yarating
createdb ielts_db

# Prisma migration ishga tushiring
npm run prisma:migrate

# (Ixtiyoriy) Prisma Studio ochish
npm run prisma:studio
```

### 5. Loyihani ishga tushirish
```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## 📚 API Documentation

Loyiha ishga tushgandan keyin Swagger dokumentatsiyasiga kirish:

**URL**: `http://localhost:3000/api/docs`

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Kirish
- `GET /api/auth/profile` - Profil ma'lumotlari
- `POST /api/auth/logout` - Chiqish

### Users
- `GET /api/users/me` - Joriy foydalanuvchi
- `PATCH /api/users/me` - Profilni yangilash
- `GET /api/users/me/stats` - Mening statistikam
- `GET /api/users` - Barcha foydalanuvchilar (Admin)

### Tests
- `POST /api/tests/sessions/start` - Test sessiyasini boshlash
- `GET /api/tests/questions/:testType` - Test savollarini olish
- `GET /api/tests/writing/prompts` - Writing promptlari
- `GET /api/tests/speaking/topics` - Speaking topiclari
- `POST /api/tests/submit/listening-reading` - Listening/Reading topshirish
- `POST /api/tests/submit/writing` - Writing topshirish
- `POST /api/tests/submit/speaking` - Speaking topshirish

### Results
- `GET /api/results/my` - Mening natijalarim
- `GET /api/results/my/stats` - Mening statistikam
- `GET /api/results/my/:testType` - Test turi bo'yicha natijalar
- `GET /api/results/:id` - Natijani ID bo'yicha olish
- `DELETE /api/results/:id` - Natijani o'chirish

## 🧪 Database Schema

### User
- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String, Hashed)
- `firstName` (String, Optional)
- `lastName` (String, Optional)
- `createdAt`, `updatedAt` (DateTime)

### TestResult
- `id` (UUID, Primary Key)
- `userId` (Foreign Key)
- `sessionId` (Foreign Key, Optional)
- `testType` (ENUM: LISTENING, READING, WRITING, SPEAKING)
- `score` (Float)
- `bandScore` (Float, 1.0-9.0)
- `maxScore` (Float)
- `responses` (JSON)
- `correctAnswers` (JSON)
- `feedback` (String)
- `aiAnalysis` (JSON, Optional)
- `createdAt` (DateTime)

### TestSession, TestQuestion, WritingPrompt, SpeakingTopic
- Test boshqarish va savollar uchun qo'shimcha jadvallar

## 🤖 AI Integration

OpenAI GPT-4o-mini model orqali Writing va Speaking testlarini professional baholash:

### Writing Evaluation
- Task Response (1-9 band)
- Coherence & Cohesion (1-9 band) 
- Lexical Resource (1-9 band)
- Grammatical Range & Accuracy (1-9 band)
- Overall Band Score
- Detailed feedback in Uzbek

### Speaking Evaluation
- Fluency & Coherence (1-9 band)
- Lexical Resource (1-9 band)
- Grammatical Range & Accuracy (1-9 band)
- Pronunciation (1-9 band)
- Overall Band Score
- Detailed feedback in Uzbek

## 🔒 Xavfsizlik

- JWT-based authentication
- Password hashing (bcryptjs)
- Rate limiting
- CORS configuration
- Input validation
- SQL injection protection (Prisma ORM)

## 🚀 Production Deployment

### Docker (tavsiya etiladi)
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Environment Variables (Production)
```env
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="complex-secret-key"
OPENAI_API_KEY="sk-..."
CORS_ORIGINS="https://your-frontend-domain.com"
```

## 📊 Test Data Seeding

Database ga test ma'lumotlarini qo'shish uchun seed script yaratish mumkin:

```bash
npx prisma db seed
```

## 🔧 Rivojlantirish

### Code Quality
```bash
# Linting
npm run lint

# Formatting  
npm run format

# Testing
npm run test
npm run test:e2e
npm run test:cov
```

### Database Operations
```bash
# Prisma Studio
npm run prisma:studio

# Database reset
npx prisma migrate reset

# New migration
npx prisma migrate dev --name migration_name
```

## 📈 Monitoring va Analytics

- Test natijalari statistikasi
- Foydalanuvchilar faolligi
- Band score taqsimoti
- AI evaluation accuracy tracking

## 🤝 Hissa Qo'shish

1. Repository fork qiling
2. Feature branch yarating (`git checkout -b feature/amazing-feature`)
3. O'zgarishlarni commit qiling (`git commit -m 'Add amazing feature'`)
4. Branch push qiling (`git push origin feature/amazing-feature`)
5. Pull Request yarating

## 📝 License

MIT License - `LICENSE` faylini ko'ring.

## 📞 Support

Savollar yoki muammolar bo'lsa:
- Email: support@ielts-check.com
- GitHub Issues: [Repository Issues](https://github.com/your-repo/issues)

---

**🎯 IELTS Level Check - Professional IELTS darajasini aniqlash tizimi**
