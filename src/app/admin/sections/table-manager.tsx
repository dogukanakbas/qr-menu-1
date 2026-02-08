import { DiningTable } from "@prisma/client";
import { Link, MapPin, Trash2 } from "lucide-react";

import { publicMenuUrl } from "@/lib/utils";
import { deleteTableAction, upsertTableAction } from "../actions";
import { TableQrCard } from "./table-qr-card";

type Props = {
  tables: DiningTable[];
};

export function TableManager({ tables }: Props) {
  const demoUrl = publicMenuUrl("demo-masa");

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-white/90 p-4 sm:p-6 lg:p-8 shadow-sm">
      <div className="flex flex-col gap-2 sm:gap-3 pb-4 sm:pb-6">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-stone-400">Bölüm 03</p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900">Masalar & QR Kodları</h2>
        <p className="max-w-2xl text-xs sm:text-sm text-stone-500">
          Her masa için benzersiz bir slug belirleyin. Oluşturulan bağlantıyı çıktı alıp QR olarak
          masaya yerleştirin.
        </p>
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs sm:text-sm font-semibold text-amber-800 border border-amber-200">
          Not: Her masada fix çerez olacaktır.
        </p>
      </div>
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 xl:grid-cols-[minmax(300px,360px)_1fr]">
        <div className="rounded-xl sm:rounded-2xl border border-dashed border-stone-200 p-4 sm:p-5 bg-stone-50/50">
          <p className="text-sm sm:text-base font-semibold text-stone-700 mb-1">Yeni masa oluştur</p>
          <p className="text-xs text-stone-500 mb-3 sm:mb-4">Yeni bir masa ekleyin</p>
          <form action={upsertTableAction} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-1.5">Masa adı</label>
              <input
                name="label"
                placeholder="Örn. Bahçe-3"
                required
                className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-1.5">Slug (URL)</label>
              <input
                name="slug"
                placeholder="bahce-3"
                required
                className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 lowercase focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-1.5">Kapasite</label>
                <input
                  name="seatingCapacity"
                  type="number"
                  min="1"
                  placeholder="4"
                  className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-stone-700 cursor-pointer">
                  <input type="checkbox" name="isActive" defaultChecked className="size-4 sm:size-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500" />
                  Aktif
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-1.5">Not</label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Örn. Baca yanında"
                className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 resize-none bg-white placeholder:text-stone-400"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 sm:py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 shadow-sm hover:shadow-md"
            >
              Kaydet
            </button>
            <div className="rounded-xl bg-stone-50 px-4 py-3 text-xs text-stone-500">
              Demo link:
              <a href={demoUrl} className="ml-2 font-semibold text-emerald-700" target="_blank">
                {demoUrl}
              </a>
            </div>
          </form>
        </div>
        <div className="space-y-4 sm:space-y-6">
          {tables.length === 0 && (
            <p className="rounded-xl sm:rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-stone-600">
              Henüz masa tanımlanmadı. Sol taraftaki formdan ilk masayı ekleyin.
            </p>
          )}
          {tables.map((table) => (
            <div key={table.id} className="rounded-xl sm:rounded-2xl border border-stone-200 bg-stone-50/70 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="space-y-1 break-words flex-1 min-w-0">
                  <p className="text-base sm:text-lg font-semibold text-stone-900">{table.label}</p>
                  <p className="text-xs sm:text-sm text-stone-500">Slug: <span className="font-mono text-xs">{table.slug}</span></p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-stone-500">
                  {table.seatingCapacity && (
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-stone-100 px-2.5 sm:px-3 py-1">
                      <MapPin className="size-3 sm:size-3.5" /> {table.seatingCapacity} kişilik
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-3 py-1 ${
                      table.isActive ? "bg-emerald-50 text-emerald-700" : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {table.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
              </div>
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(200px,240px)_1fr]">
                <TableQrCard label={table.label} slug={table.slug} url={publicMenuUrl(table.slug)} />
                <div className="rounded-xl sm:rounded-2xl border border-white bg-white p-4 sm:p-5 shadow-sm">
                  <form action={upsertTableAction} className="space-y-4 sm:space-y-5">
                    <input type="hidden" name="id" value={table.id} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-1.5">Masa adı</label>
                        <input
                          name="label"
                          defaultValue={table.label}
                          className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-1.5">Slug</label>
                        <input
                          name="slug"
                          defaultValue={table.slug}
                          className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 lowercase focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-1.5">Kapasite</label>
                        <input
                          name="seatingCapacity"
                          type="number"
                          defaultValue={table.seatingCapacity ?? ""}
                          className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-stone-700 cursor-pointer">
                          <input
                            type="checkbox"
                            name="isActive"
                            defaultChecked={table.isActive}
                            className="size-4 sm:size-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          Aktif
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-1.5">Not</label>
                      <textarea
                        name="notes"
                        rows={3}
                        defaultValue={table.notes ?? ""}
                        className="w-full rounded-xl border border-stone-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 resize-none bg-white placeholder:text-stone-400"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold text-white hover:bg-stone-800 transition-colors shadow-sm hover:shadow-md w-full sm:w-auto"
                      >
                        Güncelle
                      </button>
                    </div>
                  </form>
                  <div className="mt-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 border-t border-stone-200 pt-4">
                    <a
                      href={publicMenuUrl(table.slug)}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 sm:py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <Link className="size-4" /> Sayfayı aç
                    </a>
                    <DeleteTableButton tableId={table.id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeleteTableButton({ tableId }: { tableId: number }) {
  async function handleDelete() {
    "use server";
    await deleteTableAction(tableId);
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



