import { Category, MenuItem, Prisma } from "@prisma/client";
import { Star, EyeOff, BadgeCheck, Trash2 } from "lucide-react";

import { ImageUploader } from "@/components/image-uploader";
import { formatCurrency } from "@/lib/utils";
import { deleteMenuItemAction, upsertMenuItemAction } from "../actions";

type CategoryWithItems = Category & {
  items: MenuItem[];
};

type Props = {
  categories: CategoryWithItems[];
};

const toPlainNumber = (value: Prisma.Decimal | number) => Number(value.toString());

export function MenuItemManager({ categories }: Props) {
  const totalItems = categories.reduce((acc, category) => acc + category.items.length, 0);

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-white/90 p-4 sm:p-6 lg:p-10 shadow-sm">
      <div className="flex flex-col gap-2 sm:gap-3 pb-4 sm:pb-6">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-stone-400">Bölüm 02</p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900">Ürünler</h2>
        <p className="max-w-2xl text-xs sm:text-sm text-stone-500">
          Fiyat, açıklama, fotoğraf ve stok durumunu anlık yönetin. Her ürün mutlaka bir kategoriye
          bağlı olmalı.
        </p>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
          Toplam {totalItems} ürün
        </div>
      </div>
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-[minmax(300px,420px)_1fr]">
        <div className="rounded-xl sm:rounded-2xl border border-dashed border-stone-200 p-4 sm:p-6 bg-stone-50/50">
          <p className="text-sm sm:text-base font-semibold text-stone-700 mb-1">Yeni ürün ekle</p>
          <p className="text-xs text-stone-500 mb-3 sm:mb-4">Menüye yeni bir ürün ekleyin</p>
          <form action={upsertMenuItemAction} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Ürün adı</label>
              <input
                name="name"
                required
                placeholder="Örn. Fırınlanmış kuzu incik"
                className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Kategori</label>
              <select
                name="categoryId"
                required
                className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white"
              >
                <option value="">Kategori seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Fiyat (₺)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.5"
                  required
                  placeholder="350"
                  className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-stone-700 cursor-pointer">
                  <input type="checkbox" name="isAvailable" defaultChecked className="size-4 sm:size-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500" />
                  <span>Menüde aktif</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Kısa açıklama</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Taş fırında ağır ağır pişen kuzu incik..."
                className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 resize-none bg-white placeholder:text-stone-400"
              />
            </div>
            <ImageUploader name="imageUrl" label="Görsel" />
            <label className="flex items-center gap-2.5 text-sm font-medium text-stone-700 cursor-pointer">
              <input type="checkbox" name="featured" className="size-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500" />
              <span>Ana sayfada öne çıkar</span>
            </label>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 sm:py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 shadow-sm hover:shadow-md"
            >
              Kaydet
            </button>
          </form>
        </div>
        <div className="space-y-4 sm:space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="rounded-xl sm:rounded-2xl border border-stone-200 bg-white shadow-sm">
              <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-4 sm:py-5 border-b border-stone-200 bg-stone-50/50">
                <div className="flex-1 min-w-0">
                  <p className="text-base sm:text-lg font-semibold text-stone-900">{category.name}</p>
                  <p className="text-xs sm:text-sm text-stone-600 mt-0.5">{category.description ?? "Açıklama yok"}</p>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-full whitespace-nowrap">
                  {category.items.length} ürün
                </span>
              </header>
              <div className="space-y-3 sm:space-y-4 px-4 sm:px-6 py-4 sm:py-5">
                {category.items.length === 0 && (
                  <p className="rounded-xl border border-dashed border-stone-200 px-4 py-3 text-sm text-stone-500">
                    Bu kategoride ürün bulunmuyor.
                  </p>
                )}
                {category.items.map((item) => (
                  <details key={item.id} className="overflow-hidden rounded-xl sm:rounded-2xl border-2 border-stone-300 bg-white shadow-md hover:shadow-lg transition-all w-full min-w-0">
                    <summary className="flex cursor-pointer flex-row flex-wrap items-center justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-7 py-4 sm:py-5 lg:py-6 hover:bg-stone-100 transition-colors border-b-2 border-stone-300">
                      <div className="flex-1 min-w-0 pr-2 sm:pr-4">
                        <p className="font-bold text-stone-900 text-base sm:text-lg lg:text-xl break-words whitespace-normal leading-tight">{item.name}</p>
                      </div>
                      <div className="flex flex-shrink-0 flex-wrap items-center gap-2 sm:gap-3 justify-end">
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-emerald-700 bg-emerald-50 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg border border-emerald-200 whitespace-nowrap">
                          {formatCurrency(toPlainNumber(item.price))}
                        </span>
                        {item.isAvailable ? (
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-emerald-100 px-2 sm:px-3 py-1 sm:py-1.5 text-emerald-800 font-semibold text-xs sm:text-sm border-2 border-emerald-300 whitespace-nowrap">
                            <BadgeCheck className="size-3.5 sm:size-4" /> Menüde
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-stone-200 px-2 sm:px-3 py-1 sm:py-1.5 text-stone-700 font-semibold text-xs sm:text-sm border-2 border-stone-400 whitespace-nowrap">
                            <EyeOff className="size-3.5 sm:size-4" /> Kapalı
                          </span>
                        )}
                        {item.featured && (
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-amber-100 px-2 sm:px-3 py-1 sm:py-1.5 text-amber-800 font-semibold text-xs sm:text-sm border-2 border-amber-300 whitespace-nowrap">
                            <Star className="size-3.5 sm:size-4 fill-amber-600" /> Öne çıkan
                          </span>
                        )}
                      </div>
                    </summary>
                    <div className="border-t-2 border-stone-300 bg-stone-50/90 px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 overflow-hidden">
                      <form action={upsertMenuItemAction} className="space-y-3 sm:space-y-4 md:space-y-5 w-full max-w-full">
                        <input type="hidden" name="id" value={item.id} />
                        <div className="space-y-3 sm:space-y-4">
                          <div className="w-full">
                            <label className="block text-xs sm:text-sm md:text-base font-semibold text-stone-800 mb-1.5 sm:mb-2">Ad</label>
                            <input
                              name="name"
                              defaultValue={item.name}
                              className="w-full max-w-full rounded-lg sm:rounded-xl border-2 border-stone-300 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white font-medium box-border placeholder:text-stone-400"
                            />
                          </div>
                          <div className="w-full">
                            <label className="block text-xs sm:text-sm md:text-base font-semibold text-stone-800 mb-1.5 sm:mb-2">Fiyat</label>
                            <input
                              name="price"
                              type="number"
                              step="0.5"
                              defaultValue={toPlainNumber(item.price)}
                              className="w-full max-w-full rounded-lg sm:rounded-xl border-2 border-stone-300 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white font-medium box-border placeholder:text-stone-400"
                            />
                          </div>
                          <div className="w-full">
                            <label className="block text-xs sm:text-sm md:text-base font-semibold text-stone-800 mb-1.5 sm:mb-2">Kategori</label>
                            <select
                              name="categoryId"
                              defaultValue={category.id}
                              className="w-full max-w-full rounded-lg sm:rounded-xl border-2 border-stone-300 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white font-medium box-border"
                            >
                              {categories.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="w-full">
                          <label className="block text-xs sm:text-sm md:text-base font-semibold text-stone-800 mb-1.5 sm:mb-2">Açıklama</label>
                          <textarea
                            name="description"
                            rows={3}
                            defaultValue={item.description ?? ""}
                            className="w-full max-w-full rounded-lg sm:rounded-xl border-2 border-stone-300 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 resize-none bg-white box-border placeholder:text-stone-400"
                          />
                        </div>
                        <div className="w-full">
                          <ImageUploader
                            name="imageUrl"
                            label="Görsel"
                            defaultValue={item.imageUrl ?? ""}
                            placeholder="Yükle veya URL gir"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base font-semibold text-stone-800 pt-2">
                          <label className="inline-flex items-center gap-2 sm:gap-2.5 cursor-pointer flex-shrink-0">
                            <input
                              type="checkbox"
                              name="isAvailable"
                              defaultChecked={item.isAvailable}
                              className="size-4 sm:size-5 md:size-6 rounded border-2 border-stone-400 text-emerald-600 focus:ring-emerald-500 flex-shrink-0"
                            />
                            <span className="whitespace-nowrap">Menüde göster</span>
                          </label>
                          <label className="inline-flex items-center gap-2 sm:gap-2.5 cursor-pointer flex-shrink-0">
                            <input
                              type="checkbox"
                              name="featured"
                              defaultChecked={item.featured}
                              className="size-4 sm:size-5 md:size-6 rounded border-2 border-stone-400 text-emerald-600 focus:ring-emerald-500 flex-shrink-0"
                            />
                            <span className="whitespace-nowrap">Öne çıkar</span>
                          </label>
                        </div>
                        <div className="flex items-center justify-end gap-2 sm:gap-3 pt-2 sm:pt-3">
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-stone-900 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base font-semibold text-white hover:bg-stone-800 transition-colors shadow-md hover:shadow-lg w-full sm:w-auto min-w-[120px]"
                          >
                            Güncelle
                          </button>
                        </div>
                      </form>
                      <div className="mt-4 sm:mt-5 flex justify-end border-t-2 border-stone-300 pt-4 sm:pt-5">
                        <DeleteMenuItemButton itemId={item.id} />
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeleteMenuItemButton({ itemId }: { itemId: number }) {
  async function handleDelete() {
    "use server";
    await deleteMenuItemAction(itemId);
  }

  return (
    <form action={handleDelete} className="inline">
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300"
      >
        <Trash2 className="size-4" /> Sil
      </button>
    </form>
  );
}

