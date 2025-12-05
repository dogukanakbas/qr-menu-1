import { createUploadthing, type FileRouter } from "uploadthing/next";

import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const f = createUploadthing();

export const ourFileRouter = {
  menuImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = (await getServerSession(authOptions)) as Session | null;
      if (session?.user?.role !== "admin") {
        throw new Error("Yalnızca yöneticiler görsel yükleyebilir.");
      }

      return { userId: session.user?.email ?? "admin" };
    })
    .onUploadComplete(({ file }) => ({
      url: file.url,
    })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;



