import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoMenu = [
  {
    name: "Tercih Edilenler",
    description: "Özenle seçilmiş özel lezzetlerimiz",
    sortOrder: 0,
    items: [
      {
        name: "Serpme Kahvaltı",
        description: "2 kişilik, taze peynirler, organik reçeller, yayık tereyağı.",
        price: 350,
        imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
      {
        name: "Cheesecake",
        description: "Kremalı ve lezzetli cheesecake dilimi.",
        price: 95,
        imageUrl: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
    ],
  },
  {
    name: "Kahvaltılıklar",
    description: "Güne enerjik başlamanız için özel kahvaltı seçenekleri",
    sortOrder: 10,
    items: [
      {
        name: "Serpme Kahvaltı",
        description: "2 kişilik, taze peynirler, organik reçeller, yayık tereyağı.",
        price: 350,
        imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
      {
        name: "Menemen",
        description: "Taze yumurta, domates, biber ile hazırlanan lezzetli menemen.",
        price: 120,
        imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80",
        featured: false,
      },
    ],
  },
  {
    name: "Tatlılar",
    description: "El yapımı tatlılarımızla kendinizi şımartın",
    sortOrder: 20,
    items: [
      {
        name: "Cheesecake",
        description: "Kremalı ve lezzetli cheesecake dilimi.",
        price: 95,
        imageUrl: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
      {
        name: "Brownie",
        description: "Çikolatalı ve fındıklı brownie.",
        price: 75,
        imageUrl: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80",
        featured: false,
      },
    ],
  },
  {
    name: "Sıcak İçecekler",
    description: "Özenle hazırlanan sıcak içeceklerimiz",
    sortOrder: 30,
    items: [
      {
        name: "Espresso",
        description: "Yoğun ve aromatik espresso.",
        price: 45,
        imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80",
        featured: false,
      },
      {
        name: "Cappuccino",
        description: "Sütlü köpüklü cappuccino.",
        price: 65,
        imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
    ],
  },
  {
    name: "Soğuk İçecekler",
    description: "Serinleten ve ferahlatıcı içecekler",
    sortOrder: 40,
    items: [
      {
        name: "Iced Latte",
        description: "Soğuk sütlü kahve.",
        price: 70,
        imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80",
        featured: false,
      },
      {
        name: "Limonata",
        description: "Taze sıkılmış limonata.",
        price: 50,
        imageUrl: "https://images.unsplash.com/photo-1523677011783-c91d1bbe2fdc?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
    ],
  },
  {
    name: "Salatalar",
    description: "Taze ve sağlıklı salata çeşitleri",
    sortOrder: 50,
    items: [
      {
        name: "Akdeniz Salatası",
        description: "Taze sebzeler, zeytinyağı ve limon ile.",
        price: 85,
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
    ],
  },
];

async function main() {
  console.log("Demo menü veritabanına ekleniyor...");

  for (const categoryData of demoMenu) {
    // Kategori zaten var mı kontrol et
    const existingCategory = await prisma.category.findFirst({
      where: { name: categoryData.name },
    });

    if (existingCategory) {
      console.log(`"${categoryData.name}" kategorisi zaten mevcut, atlanıyor...`);
      continue;
    }

    // Kategoriyi oluştur
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        description: categoryData.description,
        sortOrder: categoryData.sortOrder,
        isVisible: true,
        items: {
          create: categoryData.items.map((item) => ({
            name: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
            isAvailable: true,
            featured: item.featured || false,
          })),
        },
      },
    });

    console.log(`"${categoryData.name}" kategorisi ve ${categoryData.items.length} ürün eklendi.`);
  }

  console.log("Demo menü başarıyla veritabanına eklendi!");
}

main()
  .catch((error) => {
    console.error("Hata:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
