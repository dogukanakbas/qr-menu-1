import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta girin" }),
  password: z.string().min(1, { message: "Şifre zorunlu" }),
});

async function verifyPassword(input: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return false;
  }

  if (adminPassword.startsWith("$2")) {
    try {
      return await compare(input, adminPassword);
    } catch {
      return false;
    }
  }

  return input === adminPassword;
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Yönetici Girişi",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error(parsed.error.issues[0]?.message ?? "Geçersiz giriş bilgileri");
        }

        const { email, password } = parsed.data;
        if (!process.env.ADMIN_EMAIL || email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
          return null;
        }

        const ok = await verifyPassword(password);
        if (!ok) {
          return null;
        }

        return {
          id: "admin",
          email: process.env.ADMIN_EMAIL,
          name: process.env.RESTAURANT_NAME ?? "Yörük Sofrası",
          role: "admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};



