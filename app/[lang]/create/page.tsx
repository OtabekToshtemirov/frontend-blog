"use client"

import { PostEditor } from "@/components/post-editor"
import { useTranslation } from "@/hooks/use-translation"

export default function CreatePostPage() {
  const { t } = useTranslation()
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t('create_post')}</h1>
      <PostEditor />
    </div>
  )
}

