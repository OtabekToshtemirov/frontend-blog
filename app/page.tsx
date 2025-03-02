"use client"

import { PostList } from "@/components/post-list"
import { TagCloud } from "@/components/tag-cloud"
import { LatestComments } from "@/components/latest-comments"
import { Card } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="container px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6">
      <div className="order-2 lg:order-1 lg:col-span-3">
        <PostList />
      </div>
      <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
        <Card className="p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('popular_tags')}</h2>
          <TagCloud />
        </Card>
        
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
            <h2 className="text-base sm:text-lg font-semibold">{t('latest_comments')}</h2>
          </div>
          <LatestComments />
        </Card>
      </div>
    </div>
  )
}

