import { redirect } from "next/navigation"
import { DEFAULT_LANGUAGE } from "@/lib/constants"

export default function RootLayout() {
  // Root darajadagi page uchun default tilga redirect qilamiz
  redirect(`/${DEFAULT_LANGUAGE}`)
}