"use client"

import { PostList } from "@/components/post-list"
import { TagCloud } from "@/components/tag-cloud"
import { LatestComments } from "@/components/latest-comments"

export default function Home() {
  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <PostList />
        </div>
        <div className="w-full lg:w-1/4 space-y-8">
          <TagCloud />
          <LatestComments />
        </div>
      </div>
    </div>
  )
}

