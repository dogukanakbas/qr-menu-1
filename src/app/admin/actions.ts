"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";
import {
  CategoryPayload,
  DiningTablePayload,
  MenuItemPayload,
  categorySchema,
  diningTableSchema,
  menuItemSchema,
} from "@/lib/validators";

async function assertAdmin() {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (session?.user?.role !== "admin") {
    throw new Error("Bu işlem için yetkiniz yok.");
  }
}

const bool = (value: FormDataEntryValue | null) => value === "on" || value === "true";

const numberOrUndefined = (value: FormDataEntryValue | null) =>
  value === null || value === "" ? undefined : Number(value);

const cleanString = (value: FormDataEntryValue | null) => {
  if (value === null) return undefined;
  const text = value.toString().trim();
  return text.length ? text : undefined;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

function parseCategory(formData: FormData): CategoryPayload {
  return categorySchema.parse({
    id: numberOrUndefined(formData.get("id")),
    name: String(formData.get("name") ?? ""),
    description: cleanString(formData.get("description")),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    isVisible: bool(formData.get("isVisible")),
  });
}

function parseMenuItem(formData: FormData): MenuItemPayload {
  const priceInput = formData.get("price");
  const normalizedPrice = Number(priceInput ? priceInput.toString().replace(",", ".") : 0);

  return menuItemSchema.parse({
    id: numberOrUndefined(formData.get("id")),
    name: String(formData.get("name") ?? ""),
    description: cleanString(formData.get("description")),
    price: normalizedPrice,
    imageUrl: cleanString(formData.get("imageUrl")),
    categoryId: Number(formData.get("categoryId")),
    isAvailable: bool(formData.get("isAvailable")),
    featured: bool(formData.get("featured")),
  });
}

function parseTable(formData: FormData): DiningTablePayload {
  const seatingCapacity = numberOrUndefined(formData.get("seatingCapacity"));
  const rawSlug = String(formData.get("slug") ?? "");
  const rawLabel = String(formData.get("label") ?? "");
  const normalizedSlug = rawSlug ? slugify(rawSlug) : slugify(rawLabel);

  return diningTableSchema.parse({
    id: numberOrUndefined(formData.get("id")),
    label: rawLabel,
    slug: normalizedSlug,
    seatingCapacity,
    notes: cleanString(formData.get("notes")),
    isActive: bool(formData.get("isActive")),
  });
}

export async function upsertCategoryAction(formData: FormData) {
  await assertAdmin();
  const data = parseCategory(formData);

  if (data.id) {
    await prisma.category.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        sortOrder: data.sortOrder,
        isVisible: data.isVisible,
      },
    });
  } else {
    await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        sortOrder: data.sortOrder,
        isVisible: data.isVisible,
      },
    });
  }

  revalidatePath("/admin");
}

export async function deleteCategoryAction(categoryId: number) {
  await assertAdmin();
  await prisma.menuItem.deleteMany({ where: { categoryId } });
  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin");
}

export async function upsertMenuItemAction(formData: FormData) {
  await assertAdmin();
  const data = parseMenuItem(formData);

  if (data.id) {
    await prisma.menuItem.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        isAvailable: data.isAvailable,
        featured: data.featured,
      },
    });
  } else {
    await prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        isAvailable: data.isAvailable,
        featured: data.featured,
      },
    });
  }

  revalidatePath("/admin");
}

export async function deleteMenuItemAction(menuItemId: number) {
  await assertAdmin();
  await prisma.menuItem.delete({ where: { id: menuItemId } });
  revalidatePath("/admin");
}

export async function upsertTableAction(formData: FormData) {
  await assertAdmin();
  const data = parseTable(formData);

  if (data.id) {
    await prisma.diningTable.update({
      where: { id: data.id },
      data: {
        label: data.label,
        slug: data.slug,
        seatingCapacity: data.seatingCapacity,
        notes: data.notes,
        isActive: data.isActive,
      },
    });
  } else {
    await prisma.diningTable.create({
      data: {
        label: data.label,
        slug: data.slug,
        seatingCapacity: data.seatingCapacity,
        notes: data.notes,
        isActive: data.isActive,
      },
    });
  }

  revalidatePath("/admin");
}

export async function deleteTableAction(tableId: number) {
  await assertAdmin();
  await prisma.diningTable.delete({ where: { id: tableId } });
  revalidatePath("/admin");
}

