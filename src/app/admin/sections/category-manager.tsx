import { Category, MenuItem } from "@prisma/client";
import { ArrowUpDown, Eye, EyeOff, Trash2, X } from "lucide-react";

import { upsertCategoryAction, deleteCategoryAction } from "../actions";
import { ImageUploader } from "@/components/image-uploader";

type CategoryWithItems = Category & {
  items: MenuItem[];
};

type Props = {
  categories: CategoryWithItems[];
};

export function CategoryManager({ categories }: Props) {
  return (
    <section className="rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-white/90 p-4 sm:p-6 lg:p-10 shadow-sm">
      <div className="flex flex-col gap-2 sm:gap-3 pb-4 sm:pb-6">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-stone-400">Bölüm 01</p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900">Kategoriler</h2>
        <p className="max-w-2xl text-xs sm:text-sm text-stone-500">
          Çorba, kebap, soğuk meze gibi menü bölümlerini sıralayın, açıklamalar ekleyin ve gerekirse
          hızlıca gizleyin.
        </p>
      </div>
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-[minmax(280px,380px)_1fr]">
        <div className="rounded-xl sm:rounded-2xl border border-dashed border-stone-200 p-4 sm:p-6 bg-stone-50/50">
          <p className="text-sm sm:text-base font-semibold text-stone-700 mb-1">Yeni kategori ekle</p>
          <p className="text-xs text-stone-500 mb-3 sm:mb-4">Yeni bir menü kategorisi oluşturun</p>
          <form action={upsertCategoryAction} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Başlık</label>
              <input
                name="name"
                required
                placeholder="Örn. Ana Yemekler"
                className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Açıklama</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Misafirlerinize kısa bir yönlendirme yazısı"
                className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 resize-none bg-white placeholder:text-stone-400"
              />
            </div>
            <div>
              <ImageUploader
                name="iconUrl"
                label="Kategori İkonu (Opsiyonel)"
                placeholder="İkon URL'si veya yükle"
                defaultValue=""
              />
              <p className="mt-1.5 text-xs text-stone-500">
                İkon eklenmezse kategori ismine göre otomatik ikon seçilir.
              </p>
            </div>
            <div>
              <ImageUploader
                name="categoryImageUrl"
                label="Kategori Arka Plan Görseli (Opsiyonel)"
                placeholder="Görsel URL'si veya yükle"
                defaultValue=""
              />
              <p className="mt-1.5 text-xs text-stone-500">
                Görsel eklenmezse kategorideki ilk ürünün görseli kullanılır.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Sıra</label>
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={categories.length * 10}
                  className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-stone-700 cursor-pointer">
                  <input type="checkbox" name="isVisible" defaultChecked className="size-4 sm:size-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500" />
                  <span>Misafirlere açık</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 sm:py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 shadow-sm hover:shadow-md"
            >
              Kaydet
            </button>
          </form>
        </div>
        <div className="space-y-5">
          {categories.length === 0 && (
            <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-8 py-6 text-sm text-stone-600 text-center">
              Henüz kategori oluşturmadınız. Sol taraftaki formu kullanarak ilk bölümü ekleyin.
            </p>
          )}
          {categories.map((category) => (
            <details key={category.id} className="overflow-hidden rounded-xl sm:rounded-2xl border border-stone-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <summary className="flex cursor-pointer flex-col gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 md:flex-row md:items-center md:justify-between hover:bg-stone-50 transition-colors">
                <div className="space-y-1.5 break-words flex-1 min-w-0">
                  <p className="text-base sm:text-lg font-semibold text-stone-900">{category.name}</p>
                  <p className="text-xs sm:text-sm text-stone-600">{category.description ?? "Açıklama yok"}</p>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-2.5 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 sm:px-3 py-1.5 font-semibold text-stone-700">
                    <ArrowUpDown className="size-3.5 sm:size-4" />
                    Sıra: {category.sortOrder}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 sm:px-3 py-1.5 font-semibold text-stone-700">
                    {category.isVisible ? (
                      <>
                        <Eye className="size-3.5 sm:size-4" />
                        Aktif
                      </>
                    ) : (
                      <>
                        <EyeOff className="size-3.5 sm:size-4" />
                        Gizli
                      </>
                    )}
                  </span>
                </div>
              </summary>
              <div className="border-t border-stone-100 bg-stone-50/60 px-4 sm:px-6 py-4 sm:py-6">
                <form action={upsertCategoryAction} className="grid gap-4 sm:gap-5 md:grid-cols-2">
                  <input type="hidden" name="id" value={category.id} />
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Başlık</label>
                    <input
                      name="name"
                      defaultValue={category.name}
                      className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Sıra</label>
                    <input
                      name="sortOrder"
                      type="number"
                      defaultValue={category.sortOrder}
                      className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">Açıklama</label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={category.description ?? ""}
                      className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 resize-none bg-white placeholder:text-stone-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploader
                      name="iconUrl"
                      label="Kategori İkonu"
                      placeholder="İkon URL'si veya yükle"
                      defaultValue={category.iconUrl ?? ""}
                    />
                    <div className="mt-2 flex items-center gap-2">
                      {category.iconUrl && (
                        <div className="flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-1.5">
                          <img
                            src={category.iconUrl}
                            alt="Mevcut ikon"
                            className="h-6 w-6 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <span className="text-xs text-stone-600 truncate max-w-[200px]">
                            Mevcut ikon
                          </span>
                        </div>
                      )}
                      {category.iconUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            const form = e.currentTarget.closest("form") as HTMLFormElement;
                            const iconInput = form?.querySelector('input[name="iconUrl"]') as HTMLInputElement;
                            if (iconInput) {
                              iconInput.value = "";
                              // Formu otomatik submit et
                              form.requestSubmit();
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
                        >
                          <X className="size-3.5" />
                          İkonu Sil
                        </button>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-stone-500">
                      İkon silinirse veya boş bırakılırsa kategori ismine göre otomatik ikon seçilir.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploader
                      name="categoryImageUrl"
                      label="Kategori Arka Plan Görseli"
                      placeholder="Görsel URL'si veya yükle"
                      defaultValue={category.categoryImageUrl ?? ""}
                    />
                    <div className="mt-2 flex items-center gap-2">
                      {category.categoryImageUrl && (
                        <div className="flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-1.5">
                          <img
                            src={category.categoryImageUrl}
                            alt="Mevcut görsel"
                            className="h-12 w-12 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <span className="text-xs text-stone-600 truncate max-w-[200px]">
                            Mevcut görsel
                          </span>
                        </div>
                      )}
                      {category.categoryImageUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            const form = e.currentTarget.closest("form") as HTMLFormElement;
                            const imageInput = form?.querySelector('input[name="categoryImageUrl"]') as HTMLInputElement;
                            if (imageInput) {
                              imageInput.value = "";
                              // Formu otomatik submit et
                              form.requestSubmit();
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
                        >
                          <X className="size-3.5" />
                          Görseli Sil
                        </button>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-stone-500">
                      Görsel silinirse veya boş bırakılırsa kategorideki ilk ürünün görseli kullanılır.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isVisible"
                        defaultChecked={category.isVisible}
                        className="size-4 sm:size-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Misafir menüsünde göster</span>
                    </label>
                  </div>
                  <div className="flex items-center justify-end gap-3 md:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold text-white hover:bg-stone-800 transition-colors shadow-sm hover:shadow-md w-full sm:w-auto"
                    >
                      Güncelle
                    </button>
                  </div>
                </form>
                <div className="mt-3 sm:mt-4 flex justify-end border-t border-stone-200 pt-3 sm:pt-4">
                  <DeleteCategoryButton categoryId={category.id} />
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeleteCategoryButton({ categoryId }: { categoryId: number }) {
  async function handleDelete() {
    "use server";
    await deleteCategoryAction(categoryId);
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



