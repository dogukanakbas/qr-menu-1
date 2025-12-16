import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

const restaurantName = process.env.RESTAURANT_NAME ?? "Yörük Sofrası";

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

const demoMenu: RenderCategory[] = [
  {
    id: "demo-breakfast",
    name: "Kahvaltı Sofrası",
    description: "Kendi üretimimiz peynirler ve sıcak gözleme ile güne başlangıç.",
    anchor: "category-kahvalti-sofrasi",
    items: [
      {
        id: "demo-breakfast-1",
        name: "Serpme Kahvaltı",
        description: "2 kişilik, sac böreği, organik reçeller, yayık tereyağı.",
        price: 420,
        imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80",
        featured: true,
      },
    ],
  },
  {
    id: "demo-hot",
    name: "Sıcaklar",
    description: "Odun fırınından çıkan günlük yemekler",
    anchor: "category-sicaklar",
    items: [
      {
        id: "demo-hot-1",
        name: "Güveçte Kuzu Tandır",
        description: "8 saat pişen tandır, tandırlık sebzeler, bulgur pilavı.",
        price: 580,
        imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80",
        featured: false,
      },
      {
        id: "demo-hot-2",
        name: "Odun Fırını Pide",
        description: "Dana kavurma, köy peyniri, köz biber.",
        price: 260,
        imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80",
        featured: false,
      },
    ],
  },
];

export default async function TableMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  const [table, categories] = await Promise.all([
    prisma.diningTable.findUnique({ where: { slug: normalizedSlug } }),
    prisma.category.findMany({
      where: { isVisible: true },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!table && normalizedSlug !== "demo-masa") {
    notFound();
  }

  const mappedCategories =
    categories.length > 0
      ? categories
          .map<RenderCategory>((category) => ({
            id: `cat-${category.id}`,
            name: category.name,
            description: category.description,
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
          .filter((category) => category.items.length > 0)
      : [];

  const renderCategories: RenderCategory[] =
    mappedCategories.length > 0
      ? mappedCategories
      : demoMenu.map((category) => ({
          ...category,
          anchor: `category-${slugify(category.name)}`,
        }));

  const featuredItems = renderCategories.flatMap((category) =>
    category.items.filter((item) => item.featured)
  );

  const tableName = table?.label ?? "Demo Masa";

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-100 via-white to-stone-50 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="rounded-3xl border border-[var(--color-border)] bg-white/80 p-8 text-center shadow-sm backdrop-blur">
          <div className="mb-4">
            <Image
              src="/yoruklogo.jpeg"
              alt="Gündüzbey Yörük Sofrası Logo"
              width={120}
              height={120}
              className="mx-auto rounded-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-semibold text-stone-900">Gündüzbey Yörük Sofrası</h1>
          <p className="mt-2 text-lg text-stone-600">Hoşgeldiniz</p>
        </header>

        <nav className="sticky top-0 z-10 -mx-6 flex flex-col gap-3 border-b border-stone-200 bg-gradient-to-b from-white/90 to-white px-6 py-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Ana Sayfa
              </Link>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-stone-400">Kategoriler</p>
            </div>
            <span className="text-xs text-stone-400">{renderCategories.length} bölüm</span>
          </div>
          <div className="flex snap-x gap-3 overflow-x-auto pb-1">
            {renderCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.anchor}`}
                className="group snap-center rounded-2xl bg-stone-100/80 px-4 py-3 text-sm font-semibold text-stone-600 shadow-sm ring-1 ring-transparent transition hover:bg-emerald-50 hover:text-emerald-800 hover:ring-emerald-100"
              >
                <span className="block truncate">{category.name}</span>
                <span className="mt-1 block text-xs font-normal text-stone-400 group-hover:text-emerald-500">
                  #{category.anchor.replace("category-", "")}
                </span>
              </a>
            ))}
          </div>
        </nav>

        {featuredItems.length > 0 && table && (
          <section className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-700">Şef önerisi</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {featuredItems.map((item) => (
                <article key={item.id} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="relative aspect-video overflow-hidden rounded-xl">
                    <Image
                      src={item.imageUrl ?? "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=600&q=80"}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="font-semibold text-stone-900">{item.name}</p>
                    <span className="text-sm font-semibold text-emerald-700">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-stone-500">{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-8">
          {renderCategories.map((category) => (
            <div
              key={category.id}
              id={category.anchor}
              className="scroll-mt-28 rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-stone-400">Kategori</p>
                <h2 className="text-2xl font-semibold text-stone-900">{category.name}</h2>
                <p className="text-sm text-stone-500">{category.description ?? "Yörük mutfağından seçkiler"}</p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {category.items.map((item) => (
                  <article
                    key={item.id}
                    className="group flex flex-col gap-3 rounded-2xl border border-stone-100 bg-stone-50/60 p-4 transition hover:border-emerald-100 hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-stone-900">{item.name}</p>
                        <p className="text-sm text-stone-500">{item.description}</p>
                      </div>
                        <span className="text-base font-semibold text-emerald-700">
                          {formatCurrency(item.price)}
                        </span>
                    </div>
                    <div className="relative h-40 overflow-hidden rounded-xl">
                      <Image
                        src={
                          item.imageUrl ??
                          "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

