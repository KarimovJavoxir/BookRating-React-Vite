# Kitob reytingi frontend

React + Vite + TypeScript asosida yaratilgan frontend. Frontend ASP.NET Core backend API bilan ishlaydi va API manzili `VITE_API_BASE_URL` orqali sozlanadi.

## Ishga tushirish

```bash
npm install
npm run dev
```

Default backend manzili:

```text
http://localhost:5099
```

## Tekshirish

```bash
npm run lint
npm test
npm run build
```

## Docker build va push

Frontend Docker image build vaqtida `VITE_API_BASE_URL` qiymatini bundle ichiga yozadi. Local qiymat `.env.example` bilan bir xil:

```text
VITE_API_BASE_URL=http://localhost:5099
```

Image backend compose uslubiga mos `image` va `build` konfiguratsiyasi bilan tayyorlanadi:

```bash
docker compose build
docker compose push
```

## Route tuzilmasi

- `/` - bosh sahifa
- `/books` - faqat `Verified` statusdagi kitoblar roʻyxati va live search
- `/books/:id` - verified kitob tafsilotlari va baholash UI
- `/login` - foydalanuvchi login sahifasi
- `/register` - foydalanuvchi roʻyxatdan oʻtish sahifasi
- `/admin` - admin dashboard, kitob CRUD, reytinglar va foydalanuvchilar jadvallari

## Backend integratsiyasi

- `src/services/apiClient.ts` barcha API soʻrovlarini backend base URL orqali yuboradi.
- `src/services/authService.ts` login/register va JWT session saqlash bilan ishlaydi.
- `src/services/booksService.ts` public kitoblar va admin book CRUD endpointlarini chaqiradi.
- `src/services/ratingsService.ts` authenticated rating submission uchun ishlatiladi.
- `src/services/adminService.ts` admin dashboard, users va ratings endpointlarini chaqiradi.

Admin paneldagi book status qiymatlari:

```text
New
Banned
Verified
```

Public webda faqat `Verified` kitoblar koʻrinadi. `New` va `Banned` kitoblar admin panelda koʻrinadi.
