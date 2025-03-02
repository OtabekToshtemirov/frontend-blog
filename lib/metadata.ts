import type { Metadata } from "next"
import type { Language } from "./constants"

type MetadataTranslations = {
  [key in Language]: {
    title: string
    description: string
    keywords: string[]
  }
}

export const siteMetadata: MetadataTranslations = {
  uz: {
    title: "Otablog - Zamonaviy blog platformasi",
    description: "Otablog - eng so'nggi yangiliklarni, qiziqarli maqolalarni va foydali kontentni topish mumkin bo'lgan zamonaviy blog platformasi",
    keywords: ["blog", "maqolalar", "yangiliklar", "ta'lim", "texnologiya", "dasturlash", "IT yangiliklar"]
  },
  en: {
    title: "Otablog - Modern Blog Platform",
    description: "Otablog - a modern blog platform where you can find the latest news, interesting articles and useful content",
    keywords: ["blog", "articles", "news", "education", "technology", "programming", "IT news"]
  },
  ru: {
    title: "Otablog - Современная блог-платформа",
    description: "Otablog - современная блог-платформа, где можно найти последние новости, интересные статьи и полезный контент",
    keywords: ["блог", "статьи", "новости", "образование", "технологии", "программирование", "IT новости"]
  }
}

export function generateMetadata(language: Language = "uz"): Metadata {
  return {
    title: {
      default: siteMetadata[language].title,
      template: `%s | ${siteMetadata[language].title}`,
    },
    description: siteMetadata[language].description,
    keywords: siteMetadata[language].keywords,
    authors: [{ name: "Otablog" }],
    creator: "Otablog",
    openGraph: {
      type: "website",
      locale: language,
      url: "https://otablog.uz",
      title: siteMetadata[language].title,
      description: siteMetadata[language].description,
      siteName: "Otablog",
    },
    twitter: {
      card: "summary_large_image",
      title: siteMetadata[language].title,
      description: siteMetadata[language].description,
    },
    alternates: {
      languages: {
        'uz': '/uz',
        'en': '/en',
        'ru': '/ru',
      },
    },
    verification: {
      google: "your-google-site-verification-code", // Google Search Console verification code
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}