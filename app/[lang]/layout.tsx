import { notFound } from "next/navigation"
import { RootLayoutContent } from "@/components/root-layout"
import { generateMetadata as generateSiteMetadata } from "@/lib/metadata"
import { LANGUAGES, type Language } from "@/lib/constants"
import "@/app/globals.css"

// ✅ Static Params - build paytida til variantlarini aniqlash uchun
export function generateStaticParams() {
    return Object.keys(LANGUAGES).map(lang => ({ lang }))
}

// ✅ Metadata generatsiyasi - SEO uchun
export async function generateMetadata(props) {
    // Next.js 15 async context'da props.params is an async object
    const { lang } = await props.params

    if (!lang || !LANGUAGES.hasOwnProperty(lang)) {
        notFound()
    }

    return generateSiteMetadata(lang)
}

// ✅ Layout - asosiy layout component
export default async function Layout(props) {
    // Next.js 15 da params layout props'da async bo'lib keladi
    const { lang } = await props.params
    
    if (!lang || !LANGUAGES.hasOwnProperty(lang)) {
        notFound()
    }

    return <RootLayoutContent lang={lang}>{props.children}</RootLayoutContent>
}
