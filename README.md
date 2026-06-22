# Kitob reytingi frontend

React + Vite + TypeScript asosida yaratilgan frontend. Hozircha backend ulanmagan,
maʼlumotlar `src/services/mock` ichidagi typed mock yozuvlardan olinadi.

## Ishga tushirish

```bash
npm install
npm run dev
```

## Tekshirish

```bash
npm run lint
npm test
npm run build
```

## Route tuzilmasi

- `/` - bosh sahifa
- `/books` - kitoblar roʻyxati va live search
- `/books/:id` - kitob tafsilotlari va baholash UI

## Backendga ulash uchun tayyorgarlik

`src/services/apiClient.ts` kelajakdagi ASP.NET Core API bilan ishlash uchun
ajratilgan. Backend tayyor boʻlganda mock service funksiyalarini real endpointlar
bilan almashtirish kerak.
