import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";

import { LoginForm } from "./login-form";
import { authOptions } from "@/lib/auth-options";

export default async function LoginPage() {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-xl">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-400">Yörük Sofrası</p>
          <h1 className="text-3xl font-semibold text-stone-900">Yönetici Girişi</h1>
          <p className="text-sm text-stone-500">Menü, ürün ve masa ayarlarını buradan yönetin.</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-stone-500">
          Misafir menüsüne bakmak için{" "}
          <Link href="/menu/demo-masa" className="font-medium text-emerald-700">
            QR sayfasını ziyaret edin
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

