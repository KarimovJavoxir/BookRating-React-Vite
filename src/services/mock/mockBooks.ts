import type { Book } from '../../types/book'

export const mockBooks: Book[] = [
  {
    id: 'book-001',
    title: 'Algoritmlar asoslari',
    author: 'Namuna muallif',
    category: 'Dasturlash',
    description:
      'Dasturlash asoslarini, algoritmik fikrlashni va oddiy masalalarni bosqichma-bosqich yechish tartibini koʻrsatish uchun mock yozuv.',
    publishedYear: 2024,
    averageRating: 4.6,
    ratingsCount: 18,
  },
  {
    id: 'book-002',
    title: 'Maʼlumotlar bazasi tizimlari',
    author: 'Namuna muallif',
    category: 'Maʼlumotlar bazasi',
    description:
      'Relatsion database, jadval tuzilmasi, soʻrovlar va maʼlumotlar yaxlitligi haqida demo maʼlumot.',
    publishedYear: 2023,
    averageRating: 4.3,
    ratingsCount: 14,
  },
  {
    id: 'book-003',
    title: 'Axborot xavfsizligi amaliyoti',
    author: 'Namuna muallif',
    category: 'Axborot xavfsizligi',
    description:
      'Axborot tizimida foydalanuvchi maʼlumotlarini himoyalash va xavfsiz ishlash tamoyillarini tushuntirishga moʻljallangan mock yozuv.',
    publishedYear: 2022,
    averageRating: 4.8,
    ratingsCount: 22,
  },
  {
    id: 'book-004',
    title: 'Web dasturlashga kirish',
    author: 'Namuna muallif',
    category: 'Dasturlash',
    description:
      'Frontend va backend tushunchalari, sahifa tuzilmasi hamda foydalanuvchi interfeysini yaratish boʻyicha demo yozuv.',
    publishedYear: 2024,
    averageRating: 4.1,
    ratingsCount: 11,
  },
  {
    id: 'book-005',
    title: 'Kompyuter tarmoqlari',
    author: 'Namuna muallif',
    category: 'Tarmoq texnologiyalari',
    description:
      'Tarmoq qurilmalari, protokollar va servislarning oʻzaro ishlashini yoritish uchun kiritilgan mock kitob.',
    publishedYear: 2021,
    averageRating: 3.9,
    ratingsCount: 9,
  },
  {
    id: 'book-006',
    title: 'Raqamli kutubxona xizmatlari',
    author: 'Namuna muallif',
    category: 'Axborot resurs markazi',
    description:
      'Axborot resurs markazida elektron xizmatlar, katalog va foydalanuvchi baholash jarayonini koʻrsatish uchun demo maʼlumot.',
    publishedYear: 2025,
    averageRating: 4.7,
    ratingsCount: 16,
  },
]
