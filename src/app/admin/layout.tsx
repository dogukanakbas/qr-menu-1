import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { LogOut, Menu, QrCode, Settings } from "lucide-react";
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
      <header className="border-b border-[var(--color-border)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-stone-900">
            {process.env.RESTAURANT_NAME ?? "Yörük Sofrası"} · Yönetici
          </Link>
          <div className="flex items-center gap-3 text-sm text-stone-500">
            <span>Hoş geldiniz, {session.user?.name ?? "Yönetici"}</span>
            <SignOutButton>
              <LogOut className="size-4" />
              Çıkış yap
            </SignOutButton>
          </div>
        </div>
      </header>
      <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-6xl gap-6 px-6 py-10 md:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <nav className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Menü</p>
              <ul className="mt-3 space-y-2 text-sm font-medium text-stone-600">
                <li className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-emerald-700">
                  <Menu className="size-4" /> Kategori & Ürünler
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Masalar</p>
              <ul className="mt-3 space-y-2 text-sm font-medium text-stone-600">
                <li className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-emerald-700">
                  <QrCode className="size-4" /> QR Kodları
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Ayarlar & Yardım
              </p>
              <ul className="mt-3 space-y-2 text-sm font-medium text-stone-600">
                <li className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-stone-700">
                  <Settings className="size-4" /> Sistem bilgisi
                </li>
              </ul>
            </div>
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}



