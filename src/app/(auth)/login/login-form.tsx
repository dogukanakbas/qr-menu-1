"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta girin" }),
  password: z.string().min(1, { message: "Şifre zorunlu" }),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    const response = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    setIsLoading(false);

    if (response?.error) {
      toast.error("E-posta veya şifre hatalı");
      return;
    }

    toast.success("Hoş geldiniz!");
    router.replace("/admin");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="email">
          E-posta
        </label>
        <input
          id="email"
          type="email"
          placeholder="admin@mihralicafe.com"
          className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          disabled={isLoading}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="password">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          placeholder="********"
          className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          disabled={isLoading}
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
      >
        {isLoading ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>
    </form>
  );
}



