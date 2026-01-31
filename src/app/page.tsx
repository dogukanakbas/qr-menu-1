import Image from "next/image";
import { 
  Coffee, 
  GlassWater, 
  Salad, 
  Cake, 
  UtensilsCrossed,
  ChefHat,
  Soup,
  Pizza,
  Beef,
  Fish,
  Apple,
  Milk,
  Croissant,
  Cookie,
  IceCream,
  Sandwich,
  Coffee as CoffeeIcon
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { CategoryCards } from "./category-cards";

type RenderItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  featured?: boolean;
};

type RenderCategory = {
  id: string;
  name: string;
  description?: string | null;
  items: RenderItem[];
  anchor: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9ğüşöçı\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// Kategori isimlerine göre ikon seçimi (Cafe menüsü için)
export const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes("kahvaltı") || name.includes("breakfast") || name.includes("kahvaltılık")) {
    return Croissant;
  }
  if (name.includes("tatlı") || name.includes("dessert") || name.includes("pasta") || name.includes("kek")) {
    return Cake;
  }
  if (name.includes("sıcak") && name.includes("içecek")) {
    return CoffeeIcon;
  }
  if (name.includes("soğuk") && name.includes("içecek")) {
    return GlassWater;
  }
  if (name.includes("salata")) {
    return Salad;
  }
  if (name.includes("sandviç") || name.includes("sandwich") || name.includes("tost")) {
    return Sandwich;
  }
  if (name.includes("kurabiye") || name.includes("cookie") || name.includes("bisküvi")) {
    return Cookie;
  }
  if (name.includes("dondurma") || name.includes("ice cream")) {
    return IceCream;
  }
  if (name.includes("çorba") || name.includes("soup")) {
    return Soup;
  }
  if (name.includes("pizza") || name.includes("pide")) {
    return Pizza;
  }
  if (name.includes("et") || name.includes("kavurma") || name.includes("köfte")) {
    return Beef;
  }
  if (name.includes("balık") || name.includes("fish")) {
    return Fish;
  }
  if (name.includes("meyve") || name.includes("fruit")) {
    return Apple;
  }
  if (name.includes("süt") || name.includes("milk")) {
    return Milk;
  }
  if (name.includes("ana") || name.includes("main") || name.includes("yemek")) {
    return ChefHat;
  }
  
  return UtensilsCrossed; // Varsayılan ikon
};

const demoMenu: RenderCategory[] = [
  {
    id: "demo-featured",
    name: "Tercih Edilenler",
    description: "Özenle seçilmiş özel lezzetlerimiz",
    anchor: "category-one-cikanlar",
    items: [
      {
        id: "demo-featured-1",
        name: "Serpme Kahvaltı",
        description: "2 kişilik, taze peynirler, organik reçeller, yayık tereyağı.",
        price: 350,
        imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
      {
        id: "demo-featured-2",
        name: "Cheesecake",
        description: "Kremalı ve lezzetli cheesecake dilimi.",
        price: 95,
        imageUrl: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
    ],
  },
  {
    id: "demo-breakfast",
    name: "Kahvaltılıklar",
    description: "Güne enerjik başlamanız için özel kahvaltı seçenekleri",
    anchor: "category-kahvaltiliklar",
    items: [
      {
        id: "demo-breakfast-1",
        name: "Serpme Kahvaltı",
        description: "2 kişilik, taze peynirler, organik reçeller, yayık tereyağı.",
        price: 350,
        imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
      {
        id: "demo-breakfast-2",
        name: "Menemen",
        description: "Taze yumurta, domates, biber ile hazırlanan lezzetli menemen.",
        price: 120,
        imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80",
        featured: false,
      },
    ],
  },
  {
    id: "demo-desserts",
    name: "Tatlılar",
    description: "El yapımı tatlılarımızla kendinizi şımartın",
    anchor: "category-tatlilar",
    items: [
      {
        id: "demo-dessert-1",
        name: "Cheesecake",
        description: "Kremalı ve lezzetli cheesecake dilimi.",
        price: 95,
        imageUrl: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
      {
        id: "demo-dessert-2",
        name: "Brownie",
        description: "Çikolatalı ve fındıklı brownie.",
        price: 75,
        imageUrl: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80",
        featured: false,
      },
    ],
  },
  {
    id: "demo-hot-drinks",
    name: "Sıcak İçecekler",
    description: "Özenle hazırlanan sıcak içeceklerimiz",
    anchor: "category-sicak-icecekler",
    items: [
      {
        id: "demo-hot-drink-1",
        name: "Espresso",
        description: "Yoğun ve aromatik espresso.",
        price: 45,
        imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80",
        featured: false,
      },
      {
        id: "demo-hot-drink-2",
        name: "Cappuccino",
        description: "Sütlü köpüklü cappuccino.",
        price: 65,
        imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
    ],
  },
  {
    id: "demo-cold-drinks",
    name: "Soğuk İçecekler",
    description: "Serinleten ve ferahlatıcı içecekler",
    anchor: "category-soguk-icecekler",
    items: [
      {
        id: "demo-cold-drink-1",
        name: "Iced Latte",
        description: "Soğuk sütlü kahve.",
        price: 70,
        imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80",
        featured: false,
      },
      {
        id: "demo-cold-drink-2",
        name: "Limonata",
        description: "Taze sıkılmış limonata.",
        price: 50,
        imageUrl: "https://images.unsplash.com/photo-1523677011783-c91d1bbe2fdc?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
    ],
  },
  {
    id: "demo-salads",
    name: "Salatalar",
    description: "Taze ve sağlıklı salata çeşitleri",
    anchor: "category-salatalar",
    items: [
      {
        id: "demo-salad-1",
        name: "Akdeniz Salatası",
        description: "Taze sebzeler, zeytinyağı ve limon ile.",
        price: 85,
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
    ],
  },
];

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let categories: RenderCategory[] = [];

  try {
    const dbCategories = await prisma.category.findMany({
      where: { isVisible: true },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    if (dbCategories.length > 0) {
      categories = dbCategories
        .map((category) => ({
          id: `cat-${category.id}`,
          name: category.name,
          description: category.description,
          iconUrl: category.iconUrl,
          categoryImageUrl: category.categoryImageUrl,
          anchor: `category-${slugify(category.name) || category.id}`,
          items: category.items.map((item) => ({
            id: `item-${item.id}`,
            name: item.name,
            description: item.description,
            price: Number(item.price),
            imageUrl: item.imageUrl,
            featured: item.featured,
          })),
        }))
        .filter((category) => category.items.length > 0);
      
      // Tüm kategorilerden featured: true olan ürünleri topla
      const featuredItems = categories
        .flatMap((cat) => cat.items.filter((item) => item.featured))
        .filter((item, index, self) => 
          index === self.findIndex((t) => t.id === item.id)
        ); // Duplicate'leri kaldır
      
      // "Öne Çıkanlar" kategorisi var mı kontrol et
      const hasFeaturedCategory = categories.some(
        (cat) => 
          cat.anchor?.toLowerCase().includes("one-cikan") || 
          cat.anchor?.toLowerCase().includes("featured") ||
          cat.name?.toLowerCase().includes("öne çıkan") ||
          cat.name?.toLowerCase().includes("özel seçim")
      );
      
      // Eğer featured ürünler varsa veya "Öne Çıkanlar" kategorisi yoksa, oluştur
      if (featuredItems.length > 0 || !hasFeaturedCategory) {
        // Mevcut "Öne Çıkanlar" kategorisini bul veya oluştur
        let featuredCategory = categories.find(
          (cat) => 
            cat.anchor?.toLowerCase().includes("one-cikan") || 
            cat.anchor?.toLowerCase().includes("featured") ||
            cat.name?.toLowerCase().includes("öne çıkan") ||
            cat.name?.toLowerCase().includes("özel seçim")
        );
        
        if (featuredCategory) {
          // Mevcut kategorideki ürünlere featured ürünleri ekle (duplicate yoksa)
          const existingIds = new Set(featuredCategory.items.map(item => item.id));
          const newItems = featuredItems.filter(item => !existingIds.has(item.id));
          featuredCategory.items = [...featuredCategory.items, ...newItems];
        } else {
          // Yeni "Öne Çıkanlar" kategorisi oluştur
          featuredCategory = {
            id: "featured-category",
            name: "Tercih Edilenler",
            description: "Özenle seçilmiş özel lezzetlerimiz",
            anchor: "category-one-cikanlar",
            items: featuredItems,
          };
          categories.unshift(featuredCategory);
        }
      }
    } else {
      categories = demoMenu.map((category) => ({
        ...category,
        anchor: `category-${slugify(category.name)}`,
      }));
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    categories = demoMenu.map((category) => ({
      ...category,
      anchor: `category-${slugify(category.name)}`,
    }));
  }

  return <CategoryCards categories={categories} />;
}
