import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RootLayoutContent } from "@/components/root-layout"
import { generateMetadata as generateSiteMetadata } from "@/lib/metadata"
import { LANGUAGES, type Language } from "@/lib/constants"
import "@/app/globals.css"

type Props = {
  children: React.ReactNode
  params: { lang: Language }
}

export async function generateStaticParams() {
  return Object.keys(LANGUAGES).map((lang) => ({ lang }))
}

export function generateMetadata({ params }: Props): Metadata {
  // Return 404 for invalid languages
  if (!LANGUAGES.hasOwnProperty(params.lang)) {
    return {}
  }
  return generateSiteMetadata(params.lang)
}

export default function Layout({ children, params: { lang } }: Props) {
  // Return 404 for invalid languages
  if (!LANGUAGES.hasOwnProperty(lang)) {
    notFound()
  }

  return <RootLayoutContent lang={lang}>{children}</RootLayoutContent>
}