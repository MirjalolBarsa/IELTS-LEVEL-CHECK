# IELTS Level Check - Frontend Texnik Topshiriq (TZ)

## 📋 Loyiha tavsifi

IELTS darajasini tekshirish platformasi uchun zamonaviy frontend interface yaratish.

## 🎯 Asosiy maqsad

Foydalanuvchilar IELTS testini online tarzda topshirib, real vaqtda natija olishlari mumkin bo'lgan platforma.

## 🔧 Texnik talablar

### Frontend Stack (tavsiya)

- **Framework**: React.js 18+ / Vue.js 3+ / Next.js 14+
- **CSS Framework**: Tailwind CSS / Material-UI / Ant Design
- **State Management**: Redux Toolkit / Zustand / Pinia (Vue uchun)
- **HTTP Client**: Axios / Fetch API
- **Audio Recording**: MediaRecorder API / react-audio-recorder
- **File Upload**: react-dropzone / vue-upload-component
- **Charts**: Chart.js / Recharts / ApexCharts

### Backend Integration

- **Base URL**: `http://localhost:3000`
- **API Prefix**: `/api`
- **Authentication**: JWT Bearer Token
- **CORS**: Localhost:5173 uchun sozlangan

## 📱 Sahifalar va funksiyalar

### 1. Authentication sahifalari

#### 1.1 Login sahifasi (`/login`)

**API**: `POST /api/auth/login`

```json
{
  "email": "string",
  "password": "string"
}
```

**Javob**:

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "ieltsLevel": "string"
  },
  "access_token": "string"
}
```

#### 1.2 Register sahifasi (`/register`)

**API**: `POST /api/auth/register`

```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

#### 1.3 Profile sahifasi (`/profile`)

**API**: `GET /api/auth/profile`

- Foydalanuvchi ma'lumotlarini ko'rish
- Profile yangilash imkoniyati

### 2. Dashboard (`/dashboard`)

#### 2.1 Bosh sahifa

- Foydalanuvchi statistikalari
- So'nggi test natijalari
- IELTS darajasi ko'rsatkichi
- Test boshlash tugmalari

**API'lar**:

- `GET /api/users/me/stats` - statistika
- `GET /api/results/my` - so'nggi natijalar

### 3. Test sahifalari

#### 3.1 Test boshlash (`/test/start`)

**API**: `POST /api/tests/sessions/start`

```json
{
  "testType": "LISTENING" | "READING" | "WRITING" | "SPEAKING"
}
```

#### 3.2 Reading Test (`/test/reading`)

**API**: `GET /api/tests/questions/READING`

- Matn va savollar ko'rsatish
- Javoblarni tanlash interfeysi
- Timer (60 daqiqa)
- Progress bar

**Submit**: `POST /api/tests/submit/listening-reading`

```json
{
  "sessionId": "string",
  "testType": "READING",
  "answers": [
    {
      "questionId": "string",
      "answer": "string"
    }
  ]
}
```

#### 3.3 Listening Test (`/test/listening`)

**API**: `GET /api/tests/questions/LISTENING`

- Audio player (30 daqiqa)
- Savol-javob interfeysi
- Replay imkoniyati (cheklangan)

#### 3.4 Writing Test (`/test/writing`)

**API'lar**:

- `GET /api/tests/writing/prompts?taskType=TASK_1` - Task 1 prompts
- `GET /api/tests/writing/prompts?taskType=TASK_2` - Task 2 prompts

**Funksiyalar**:

- Rich text editor (150/250 so'z minimum)
- So'z hisoblash
- Timer (60 daqiqa)
- Auto-save

**Submit**: `POST /api/tests/submit/writing`

```json
{
  "sessionId": "string",
  "task1Response": "string",
  "task2Response": "string",
  "wordCountTask1": number,
  "wordCountTask2": number
}
```

#### 3.5 Speaking Test (`/test/speaking`)

**API**: `GET /api/tests/speaking/topics`

**Funksiyalar**:

- Audio recording (MediaRecorder API)
- 3 ta qism (Part 1, 2, 3)
- Har qism uchun alohida timer
- Recording preview

**Audio Upload**: `POST /api/tests/upload/audio`

- FormData bilan audio fayl yuklash

**Submit**: `POST /api/tests/submit/speaking`

```json
{
  "sessionId": "string",
  "part1Response": "string",
  "part2Response": "string",
  "part3Response": "string",
  "recordingQuality": "GOOD" | "AVERAGE" | "POOR"
}
```

### 4. Natijalar sahifasi (`/results`)

#### 4.1 Barcha natijalar

**API**: `GET /api/results/my`

- Jadval ko'rinishida
- Filterlash (test turi, sana)
- Sorting

#### 4.2 Statistika

**API**: `GET /api/results/my/stats`

- Chart.js bilan grafik
- Darajalar o'zgarishi
- Har skill bo'yicha tahlil

#### 4.3 Natija tafsilotlari (`/results/:id`)

**API**: `GET /api/results/:id`

- To'liq natija ko'rish
- Skill bo'yicha breakdown
- AI feedback (Writing/Speaking)

## 🎨 UI/UX Talablari

### Design Principles

- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA standartlari
- **Modern Interface**: Clean, professional ko'rinish
- **Color Scheme**: IELTS branding ranglari (ko'k, oq, kulrang)

### User Experience

- **Intuitive Navigation**: Oson navigatsiya
- **Progress Indicators**: Test davomida progress ko'rsatish
- **Error Handling**: User-friendly xato xabarlari
- **Loading States**: Yuklanish indikatorlari
- **Offline Support**: Asosiy funksiyalar offline ishlashi

### Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## ⚡ Performance talablari

### Core Web Vitals

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Optimization

- **Code Splitting**: Route-based chunking
- **Image Optimization**: WebP format, lazy loading
- **Bundle Size**: < 1MB initial load
- **Caching**: Service Worker bilan

## 🔒 Security talablari

### Authentication

- JWT tokenni localStorage/sessionStorage da saqlash
- Token expiry handling
- Auto logout qilish

### Data Protection

- Input validation (client-side)
- XSS himoyasi
- HTTPS majburiy (production)

## 📊 Analytics va Monitoring

### User Analytics

- Test completion rates
- Popular test types
- User engagement metrics

### Error Tracking

- JavaScript errors
- API call failures
- Performance issues

## 🧪 Testing talablari

### Unit Tests

- Components testing (Jest + React Testing Library)
- Utility functions testing
- 80%+ code coverage

### Integration Tests

- API integration testing
- User flow testing
- E2E tests (Cypress/Playwright)

## 📂 Loyiha strukturasi (tavsiya)

```
frontend/
├── public/
│   ├── index.html
│   └── icons/
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/         # Button, Input, Modal, etc.
│   │   ├── forms/          # Login, Register forms
│   │   ├── test/           # Test-specific components
│   │   └── charts/         # Chart components
│   ├── pages/              # Page components
│   │   ├── auth/           # Login, Register
│   │   ├── dashboard/      # Dashboard
│   │   ├── test/           # Test pages
│   │   └── results/        # Results pages
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API calls
│   ├── store/              # State management
│   ├── utils/              # Helper functions
│   ├── types/              # TypeScript types
│   └── constants/          # App constants
├── package.json
└── README.md
```

## 🚀 Deployment

### Development

- **Port**: 5173 (Vite default)
- **Hot Reload**: Development server
- **Proxy**: Backend API calls

### Production

- **Platform**: Vercel / Netlify / AWS S3+CloudFront
- **Build Command**: `npm run build`
- **Environment Variables**: API URLs, keys

## 📋 MVP funksiyalar (Minimum Viable Product)

### Phase 1 (1-2 hafta)

1. ✅ Authentication (Login/Register)
2. ✅ Dashboard (basic)
3. ✅ Reading Test
4. ✅ Listening Test

### Phase 2 (2-3 hafta)

1. ✅ Writing Test
2. ✅ Speaking Test
3. ✅ Results va Statistics
4. ✅ Profile management

### Phase 3 (1 hafta)

1. ✅ Performance optimization
2. ✅ Testing va bug fixes
3. ✅ Production deployment

## 🔗 API Endpoint'lar ro'yxati

### Auth Endpoints

- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Kirish
- `GET /api/auth/profile` - Profile olish
- `POST /api/auth/logout` - Chiqish

### Test Endpoints

- `POST /api/tests/sessions/start` - Test boshlash
- `GET /api/tests/questions/:testType` - Test savollarini olish
- `GET /api/tests/writing/prompts` - Writing promptlari
- `GET /api/tests/speaking/topics` - Speaking mavzulari
- `POST /api/tests/submit/listening-reading` - L/R natijalarini yuborish
- `POST /api/tests/submit/writing` - Writing natijasini yuborish
- `POST /api/tests/submit/speaking` - Speaking natijasini yuborish
- `POST /api/tests/upload/audio` - Audio fayl yuklash

### Results Endpoints

- `GET /api/results/my` - Mening natijalarim
- `GET /api/results/my/stats` - Mening statistikam
- `GET /api/results/my/:testType` - Test turi bo'yicha natijalar
- `GET /api/results/:id` - Aniq natija
- `DELETE /api/results/:id` - Natijani o'chirish

### Users Endpoints

- `GET /api/users/me` - Mening ma'lumotlarim
- `GET /api/users/me/stats` - Mening statistikam
- `PATCH /api/users/me` - Ma'lumotlarni yangilash

## 📞 Qo'shimcha talablar

### Internationalization (i18n)

- O'zbek tili (asosiy)
- Ingliz tili (qo'shimcha)
- Rus tili (qo'shimcha)

### Accessibility

- Screen reader support
- Keyboard navigation
- High contrast mode
- Font size adjustment

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📝 Eslatma

Bu TZ backend API'ga asoslanib tuzilgan. Barcha endpoint'lar test qilingan va ishlaydi.

**CORS localhost:5173 uchun sozlangan**, shuning uchun development server shu portda ishga tushirilishi kerak.

**Backend URL**: `http://localhost:3000`
**Frontend URL**: `http://localhost:5173`

Agar qo'shimcha savol yoki tushuntirish kerak bo'lsa, bemalol so'rang! 🚀
