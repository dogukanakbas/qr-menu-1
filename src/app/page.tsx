import { redirect } from "next/navigation";

export default function Home() {
  // Ana sayfa için güncellenmiş HTML sayfasına yönlendir
  redirect("/site/index.html");
}
