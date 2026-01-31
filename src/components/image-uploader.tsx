"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import toast from "react-hot-toast";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

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

  return (
    <div className="space-y-2 sm:space-y-2.5 min-w-0">
      <label className="block text-xs sm:text-sm font-medium text-stone-700">{label}</label>
      <div className="flex flex-col gap-2 sm:gap-3">
        <input
          name={name}
          type="url"
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          className="w-full rounded-lg sm:rounded-xl border border-stone-300 px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white placeholder:text-stone-400"
        />
        <UploadButton<OurFileRouter, "menuImage">
          endpoint="menuImage"
          appearance={{
            button:
              "inline-flex items-center justify-center rounded-lg sm:rounded-xl border border-dashed border-emerald-300 px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50 w-full",
          }}
          onUploadProgress={() => setIsUploading(true)}
          onClientUploadComplete={(res) => {
            setIsUploading(false);
            const url = res?.[0]?.url;
            if (url) {
              setValue(url);
              toast.success("Görsel yüklendi!");
            }
          }}
          onUploadError={(error) => {
            setIsUploading(false);
            toast.error(error.message ?? "Yükleme başarısız");
          }}
        />
        {isUploading && <p className="text-xs sm:text-sm text-emerald-600 font-medium">Yükleniyor...</p>}
        {value && (
          <p className="truncate text-xs text-stone-600 bg-stone-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
            Aktif URL: <span className="font-medium text-stone-800 break-all">{value}</span>
          </p>
        )}
      </div>
    </div>
  );
}



