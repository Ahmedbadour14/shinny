import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const products = [
  {
    name: 'Golden Sunrise Clutch',
    nameAr: 'حقيبة يد الشروق الذهبي',
    description: 'A stunning handmade clutch adorned with golden and amber beads, perfect for elegant evenings.',
    descriptionAr: 'حقيبة يد مذهلة مصنوعة يدوياً مزينة بالخرز الذهبي والعنبري، مثالية للسهرات الأنيقة.',
    price: 850,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    ]),
    category: 'Clutch',
    colors: JSON.stringify(['Gold', 'Amber']),
    sizes: JSON.stringify(['One Size']),
    stock: 15,
    featured: true,
  },
  {
    name: 'Midnight Blue Shoulder Bag',
    nameAr: 'حقيبة كتف أزرق منتصف الليل',
    description: 'Elegant shoulder bag with intricate midnight blue and silver bead patterns.',
    descriptionAr: 'حقيبة كتف أنيقة بنقوش خرز أزرق فاتح وفضي معقدة.',
    price: 1250,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1566150905458-1bf1f62b7295?w=800&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
    ]),
    category: 'Shoulder Bag',
    colors: JSON.stringify(['Blue', 'Silver']),
    sizes: JSON.stringify(['Medium', 'Large']),
    stock: 10,
    featured: true,
  },
  {
    name: 'Rose Garden Small Bag',
    nameAr: 'حقيبة صغيرة حديقة الورود',
    description: 'Delicate small bag with pink and rose gold bead work inspired by Egyptian gardens.',
    descriptionAr: 'حقيبة صغيرة رقيقة بخرز وردي وذهب وردي مستوحاة من الحدائق المصرية.',
    price: 650,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    ]),
    category: 'Small',
    colors: JSON.stringify(['Pink', 'Rose Gold']),
    sizes: JSON.stringify(['Small']),
    stock: 20,
    featured: true,
  },
  {
    name: 'Desert Sand Medium Bag',
    nameAr: 'حقيبة متوسطة رمال الصحراء',
    description: 'Medium-sized bag in warm desert tones, handcrafted with cream and tan beads.',
    descriptionAr: 'حقيبة متوسطة الحجم بألوان الصحراء الدافئة، مصنوعة يدوياً بخرز كريمي وبيج.',
    price: 950,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
      'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&q=80',
    ]),
    category: 'Medium',
    colors: JSON.stringify(['Cream', 'Tan']),
    sizes: JSON.stringify(['Medium']),
    stock: 12,
    featured: false,
  },
  {
    name: 'Emerald Luxe Large Bag',
    nameAr: 'حقيبة كبيرة فاخرة زمردية',
    description: 'Statement large bag with rich emerald green and gold bead detailing.',
    descriptionAr: 'حقيبة كبيرة مبهرة بتفاصيل خرز أخضر زمردي وذهبي.',
    price: 1550,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1559563458-527498076e2e?w=800&q=80',
      'https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=800&q=80',
    ]),
    category: 'Large',
    colors: JSON.stringify(['Emerald', 'Gold']),
    sizes: JSON.stringify(['Large']),
    stock: 8,
    featured: true,
  },
  {
    name: 'Pearl White Clutch',
    nameAr: 'حقيبة يد بيضاء لؤلؤية',
    description: 'Timeless white pearl clutch perfect for weddings and special occasions.',
    descriptionAr: 'حقيبة يد لؤلؤية بيضاء خالدة، مثالية للأعراس والمناسبات الخاصة.',
    price: 780,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    ]),
    category: 'Clutch',
    colors: JSON.stringify(['White', 'Pearl']),
    sizes: JSON.stringify(['One Size']),
    stock: 18,
    featured: false,
  },
  {
    name: 'Turquoise Nile Shoulder Bag',
    nameAr: 'حقيبة كتف تركوازي النيل',
    description: 'Vibrant turquoise shoulder bag inspired by the colors of the River Nile.',
    descriptionAr: 'حقيبة كتف تركوازية نابضة بالحياة مستوحاة من ألوان نهر النيل.',
    price: 1100,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1f62b7295?w=800&q=80',
    ]),
    category: 'Shoulder Bag',
    colors: JSON.stringify(['Turquoise', 'Teal']),
    sizes: JSON.stringify(['Medium', 'Large']),
    stock: 9,
    featured: true,
  },
  {
    name: 'Crimson Jewel Small Bag',
    nameAr: 'حقيبة صغيرة قرمزية جوهرة',
    description: 'Bold crimson and garnet bead small bag — a true statement piece.',
    descriptionAr: 'حقيبة صغيرة قرمزية وياقوت — قطعة تعبيرية حقيقية.',
    price: 720,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=800&q=80',
    ]),
    category: 'Small',
    colors: JSON.stringify(['Crimson', 'Garnet']),
    sizes: JSON.stringify(['Small']),
    stock: 14,
    featured: false,
  },
  {
    name: 'Pharaoh Gold Large Bag',
    nameAr: 'حقيبة كبيرة ذهب الفراعنة',
    description: 'Inspired by ancient Egyptian royalty — massive gold bead tote with hieroglyphic motifs.',
    descriptionAr: 'مستوحاة من ملوك مصر القديمة — حقيبة كبيرة بخرز ذهبي ونقوش هيروغليفية.',
    price: 1800,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    ]),
    category: 'Large',
    colors: JSON.stringify(['Gold', 'Black']),
    sizes: JSON.stringify(['Large']),
    stock: 6,
    featured: true,
  },
  {
    name: 'Lavender Dream Medium Bag',
    nameAr: 'حقيبة متوسطة حلم اللافندر',
    description: 'Soft lavender and purple bead medium bag, dreamy and romantic.',
    descriptionAr: 'حقيبة متوسطة بخرز لافندر وأرجواني ناعم، رومانسية وحالمة.',
    price: 880,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1559563458-527498076e2e?w=800&q=80',
    ]),
    category: 'Medium',
    colors: JSON.stringify(['Lavender', 'Purple']),
    sizes: JSON.stringify(['Medium']),
    stock: 11,
    featured: false,
  },
  {
    name: 'Copper Sunrise Clutch',
    nameAr: 'حقيبة يد شروق النحاس',
    description: 'Warm copper and bronze bead clutch that catches every light beautifully.',
    descriptionAr: 'حقيبة يد بخرز نحاسي وبرونزي دافئ تتألق مع كل إضاءة.',
    price: 820,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80',
    ]),
    category: 'Clutch',
    colors: JSON.stringify(['Copper', 'Bronze']),
    sizes: JSON.stringify(['One Size']),
    stock: 16,
    featured: false,
  },
  {
    name: 'Sahara Sunset Shoulder Bag',
    nameAr: 'حقيبة كتف غروب الصحراء',
    description: 'Sunset-hued shoulder bag with orange, red and gold bead gradient effect.',
    descriptionAr: 'حقيبة كتف بألوان الغروب مع تأثير تدرجي من الخرز البرتقالي والأحمر والذهبي.',
    price: 1350,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=800&q=80',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    ]),
    category: 'Shoulder Bag',
    colors: JSON.stringify(['Orange', 'Red', 'Gold']),
    sizes: JSON.stringify(['Medium', 'Large']),
    stock: 7,
    featured: true,
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Seed products
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(product) + 1 },
      update: product,
      create: product,
    })
  }

  // Seed promo codes
  await prisma.promoCode.upsert({
    where: { code: 'SHINNY10' },
    update: {},
    create: { code: 'SHINNY10', discount: 10, active: true },
  })
  await prisma.promoCode.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: { code: 'WELCOME20', discount: 20, active: true },
  })

  // Seed admin
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'shinny@admin123', 10)
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@shinny.eg' },
    update: { passwordHash },
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@shinny.eg',
      passwordHash,
    },
  })

  console.log(`✅ Seeded ${products.length} products, 2 promo codes, and 1 admin.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
