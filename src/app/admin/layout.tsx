import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { LogOut } from "lucide-react";
import { ReactNode } from "react";

import { authOptions } from "@/lib/auth-options";
import { SignOutButton } from "./sign-out-button";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (session?.user?.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-[var(--color-border)] bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <Link href="/" className="text-base sm:text-lg font-semibold text-stone-900 truncate">
            {process.env.RESTAURANT_NAME ?? "Mihrali Cafe"} · Yönetici
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-stone-500">
            <span className="hidden sm:inline">Hoş geldiniz, {session.user?.name ?? "Yönetici"}</span>
            <SignOutButton>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Çıkış yap</span>
            </SignOutButton>
          </div>
        </div>
      </header>
      <div className="mx-auto min-h-[calc(100vh-65px)] max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="w-full">{children}</section>
      </div>
    </div>
  );
}



