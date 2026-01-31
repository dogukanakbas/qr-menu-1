import { prisma } from "@/lib/prisma";

import { CategoryManager } from "./sections/category-manager";
import { MenuItemManager } from "./sections/menu-item-manager";
import { TableManager } from "./sections/table-manager";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const [categories, tables] = await Promise.all([
    prisma.category.findMany({
      include: { items: { orderBy: { name: "asc" } } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.diningTable.findMany({ orderBy: { label: "asc" } }),
  ]);

  console.log("Admin Page - Categories count:", categories.length);
  console.log("Admin Page - Total items:", categories.reduce((acc, cat) => acc + cat.items.length, 0));

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      <CategoryManager categories={categories} />
      <MenuItemManager categories={categories} />
      <TableManager tables={tables} />
    </div>
  );
}



