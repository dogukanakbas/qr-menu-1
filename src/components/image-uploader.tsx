"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { uploadFiles } from "@/lib/uploadthing";

type Props = {
  name: string;
  label?: string;
  defaultValue?: string | null;
  placeholder?: string;
};

export function ImageUploader({
  name,
  label = "Görsel adresi",
  defaultValue = "",
  placeholder = "https://... veya yükle",
}: Props) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const response = await uploadFiles("menuImage", { files: Array.from(files) });
      const url = response?.[0]?.url;
      if (url) {
        setValue(url);
        toast.success("Görsel yüklendi!");
      } else {
        throw new Error("Yükleme başarısız");
      }
    } catch (error: any) {
      toast.error(error?.message ?? "Yükleme başarısız");
    } finally {
      setIsUploading(false);
      // Aynı dosyayı tekrar seçebilmek için input'u temizle
      event.target.value = "";
    }
  }

  function triggerFileDialog() {
    fileInputRef.current?.click();
  }

  return (
    <div className="space-y-2 sm:space-y-2.5 min-w-0">
      <label className="block text-xs sm:text-sm font-medium text-stone-700">{label}</label>
      <div className="flex flex-col gap-2 sm:gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          name={name}
          type="url"
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          className="w-full rounded-lg sm:rounded-xl border border-stone-300 px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
        />
        <button
          type="button"
          onClick={triggerFileDialog}
          disabled={isUploading}
          className="w-full inline-flex items-center justify-center text-center whitespace-nowrap rounded-lg sm:rounded-xl border border-emerald-700 bg-emerald-700 px-3 sm:px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-800 hover:bg-emerald-800 shadow-sm min-h-[40px] max-w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isUploading ? "Yükleniyor..." : "Dosya seç"}
        </button>
        {isUploading && <p className="text-xs sm:text-sm text-emerald-600 font-medium">Yükleniyor...</p>}
        <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed">
          UploadThing kullanılmaktadır. <span className="font-semibold">UPLOADTHING_APP_ID</span> ve
          <span className="font-semibold"> UPLOADTHING_SECRET</span> değerlerini <a href="https://uploadthing.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold underline">uploadthing.com</a> panelinden alıp
          .env dosyanıza ekleyin; aksi halde yükleme başarısız olur.
        </p>
        {value && (
          <p className="truncate text-xs text-stone-600 bg-stone-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
            Aktif URL: <span className="font-medium text-stone-800 break-all">{value}</span>
          </p>
        )}
      </div>
    </div>
  );
}



