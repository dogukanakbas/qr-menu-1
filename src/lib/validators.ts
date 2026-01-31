import { z } from "zod";

export const categorySchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalı"),
  description: z.string().max(240, "En fazla 240 karakter").optional(),
  iconUrl: z.string().url("Geçerli bir görsel adresi girin").optional().or(z.literal("")),
  categoryImageUrl: z.string().url("Geçerli bir görsel adresi girin").optional().or(z.literal("")),
  isVisible: z.boolean(),
  sortOrder: z.number().int().min(0, "Sıra değeri 0 veya daha büyük olmalı"),
});

export type CategoryPayload = z.infer<typeof categorySchema>;

export const menuItemSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı"),
  description: z.string().optional(),
  price: z.number().min(0, "Geçerli bir fiyat girin"),
  imageUrl: z.string().url("Geçerli bir görsel adresi girin").optional(),
  categoryId: z.number().int().positive({ message: "Kategori seçmek zorunlu" }),
  isAvailable: z.boolean(),
  featured: z.boolean(),
});

export type MenuItemPayload = z.infer<typeof menuItemSchema>;

export const diningTableSchema = z.object({
  id: z.number().int().positive().optional(),
  label: z.string().min(2, "Masa adı en az 2 karakter olmalı"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, sayı ve tire içermeli"),
  seatingCapacity: z.number().int().positive("Kapasite pozitif bir sayı olmalı").optional(),
  notes: z.string().optional(),
  isActive: z.boolean(),
});

export type DiningTablePayload = z.infer<typeof diningTableSchema>;

