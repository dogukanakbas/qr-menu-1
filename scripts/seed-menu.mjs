import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const menuData = [
  {
    name: "Kahvaltı & Sıcak Tava",
    description: "Lezzetli kahvaltı ve sıcak tava seçenekleri",
    sortOrder: 10,
    items: [
      { name: "Menemen", price: 160, featured: true },
      { name: "Kaşarlı Menemen", price: 180, featured: false },
      { name: "Sucuklu Menemen", price: 200, featured: true },
      { name: "Sucuklu Yumurta", price: 190, featured: false },
      { name: "Omlet (Sade)", price: 150, featured: false },
      { name: "Omlet (Kaşarlı)", price: 170, featured: false },
    ],
  },
  {
    name: "Tost & Sandviçler",
    description: "Taze hazırlanmış tost ve sandviç çeşitlerimiz",
    sortOrder: 20,
    items: [
      { name: "Kaşarlı Tost", price: 140, featured: false },
      { name: "Karışık Tost", price: 160, featured: true },
      { name: "Sucuklu Tost", price: 170, featured: false },
      { name: "Ayvalık Tostu", price: 200, featured: true },
      { name: "Tavuk Sandviç", price: 180, featured: false },
      { name: "Ton Balıklı Sandviç", price: 190, featured: false },
    ],
  },
  {
    name: "Burgerler",
    description: "Özel hazırlanmış burger çeşitlerimiz",
    sortOrder: 30,
    items: [
      { name: "Hamburger", price: 200, featured: true },
      { name: "Cheeseburger", price: 220, featured: true },
      { name: "Tavuk Burger", price: 210, featured: false },
      { name: "Double Burger", price: 260, featured: true },
      { name: "Patatesli Menü", price: 40, featured: false },
    ],
  },
  {
    name: "Makarnalar",
    description: "Özel soslu makarna çeşitlerimiz",
    sortOrder: 40,
    items: [
      { name: "Penne Alfredo", price: 220, featured: true },
      { name: "Tavuklu Makarna", price: 230, featured: false },
      { name: "Köri Soslu Tavuklu Makarna", price: 240, featured: true },
      { name: "Napoliten Makarna", price: 200, featured: false },
      { name: "Bolonez Makarna", price: 240, featured: true },
    ],
  },
  {
    name: "Aperatifler",
    description: "Lezzetli aperatif seçeneklerimiz",
    sortOrder: 50,
    items: [
      { name: "Patates Kızartması", price: 120, featured: false },
      { name: "Baharatlı Patates", price: 130, featured: false },
      { name: "Soğan Halkası", price: 120, featured: false },
      { name: "Sigara Böreği", price: 130, featured: false },
      { name: "Sosis Tabağı", price: 150, featured: false },
      { name: "Çıtır Tavuk", price: 180, featured: true },
      { name: "Nachos", price: 160, featured: false },
    ],
  },
  {
    name: "Tatlılar",
    description: "El yapımı tatlılarımız",
    sortOrder: 60,
    items: [
      { name: "Waffle", price: 200, featured: false },
      { name: "Antep Fıstıklı Waffle", price: 260, featured: true },
      { name: "Magnolia", price: 200, featured: false },
      { name: "Profiterol", price: 200, featured: false },
      { name: "Çikolatalı Sufle", price: 200, featured: true },
      { name: "Cheesecake (Frambuazlı)", price: 200, featured: true },
      { name: "Tiramisu", price: 200, featured: true },
    ],
  },
  {
    name: "Kahveler",
    description: "Özenle hazırlanan kahve çeşitlerimiz",
    sortOrder: 70,
    items: [
      { name: "Türk Kahvesi", price: 110, featured: true },
      { name: "Sütlü Türk Kahvesi", price: 90, featured: false },
      { name: "Damla Sakızlı Türk Kahvesi", price: 80, featured: false },
      { name: "Espresso", price: 110, featured: false },
      { name: "Americano", price: 110, featured: false },
      { name: "Latte / Cappuccino", price: 110, featured: true },
      { name: "Filtre Kahve", price: 110, featured: false },
    ],
  },
  {
    name: "Soğuk Kahveler",
    description: "Serinleten soğuk kahve çeşitlerimiz",
    sortOrder: 80,
    items: [
      { name: "Iced Latte", price: 110, featured: true },
      { name: "Iced Mocha", price: 110, featured: false },
      { name: "Iced Americano", price: 100, featured: false },
    ],
  },
  {
    name: "Kokteyller",
    description: "Özel hazırlanmış kokteyllerimiz",
    sortOrder: 90,
    items: [
      { name: "Mojito", price: 110, featured: false },
      { name: "Gökkuşağı", price: 140, featured: true },
      { name: "Escobar", price: 140, featured: true },
      { name: "Cool Lime", price: 120, featured: false },
      { name: "Bubble Tea", price: 130, featured: false },
      { name: "Milkshake", price: 120, featured: false },
    ],
  },
];

// Unsplash görselleri için kategori bazlı görsel URL'leri
const getImageUrl = (categoryName, itemName) => {
  const category = categoryName.toLowerCase();
  const name = itemName.toLowerCase();
  
  // Kahvaltı & Sıcak Tava
  if (category.includes("kahvaltı") || category.includes("tava") || name.includes("menemen") || name.includes("omlet") || name.includes("yumurta")) {
    return "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80";
  }
  
  // Tost & Sandviçler
  if (category.includes("tost") || category.includes("sandviç")) {
    return "https://images.unsplash.com/photo-1528735602780-2ad94e004336?auto=format&fit=crop&w=600&q=80";
  }
  
  // Burgerler
  if (category.includes("burger")) {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80";
  }
  
  // Makarnalar
  if (category.includes("makarna")) {
    return "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80";
  }
  
  // Aperatifler
  if (category.includes("aperatif")) {
    if (name.includes("patates")) {
      return "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80";
    }
    if (name.includes("tavuk")) {
      return "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80";
    }
    return "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80";
  }
  
  // Tatlılar
  if (category.includes("tatlı")) {
    if (name.includes("waffle")) {
      return "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80";
    }
    if (name.includes("cheesecake")) {
      return "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80";
    }
    if (name.includes("tiramisu")) {
      return "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80";
    }
    return "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80";
  }
  
  // Kahveler
  if (category.includes("kahve") && !category.includes("soğuk")) {
    if (name.includes("türk")) {
      return "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80";
    }
    return "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80";
  }
  
  // Soğuk Kahveler
  if (category.includes("soğuk") || name.includes("iced")) {
    return "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80";
  }
  
  // Kokteyller
  if (category.includes("kokteyl")) {
    return "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80";
  }
  
  // Varsayılan
  return "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80";
};

async function main() {
  console.log("Menü veritabanına ekleniyor...");
  console.log("⚠️  Mevcut tüm kategoriler ve ürünler temizleniyor...\n");

  // Önce mevcut tüm ürünleri ve kategorileri temizle
  await prisma.menuItem.deleteMany({});
  await prisma.category.deleteMany({});

  console.log("✅ Veritabanı temizlendi.\n");

  for (const categoryData of menuData) {
    // Yeni kategori oluştur
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        description: categoryData.description,
        sortOrder: categoryData.sortOrder,
        isVisible: true,
        items: {
          create: categoryData.items.map((item) => ({
            name: item.name,
            price: item.price,
            imageUrl: getImageUrl(categoryData.name, item.name),
            isAvailable: true,
            featured: item.featured || false,
          })),
        },
      },
    });

    console.log(`✓ "${categoryData.name}" kategorisi ve ${categoryData.items.length} ürün eklendi.`);
  }

  console.log("\n✅ Menü başarıyla veritabanına eklendi!");
  
  // Özet
  const totalCategories = await prisma.category.count();
  const totalItems = await prisma.menuItem.count();
  console.log(`\n📊 Toplam: ${totalCategories} kategori, ${totalItems} ürün`);
}

main()
  .catch((error) => {
    console.error("❌ Hata:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
