"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReactMarkdown from 'react-markdown'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { createPost, updatePost } from "@/lib/api/posts"
import { uploadImage } from "@/lib/api/upload"
import type { Post } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"

interface PostEditorProps {
  post?: Post
}

export function PostEditor({ post }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [description, setDescription] = useState(post?.description || "")
  const [tags, setTags] = useState(post?.tags.join(", ") || "")
  const [images, setImages] = useState<string[]>(post?.photo || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!post
  const [activeTab, setActiveTab] = useState("edit")

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create or edit posts",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user, router, toast])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const imageUrl = await uploadImage(formData)
      setImages([...images, imageUrl])

      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Clean and format tags, removing #
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim().replace(/^#/, ''))
        .filter((tag) => tag.length > 0)

      const postData = {
        title,
        description,
        tags: tagArray,
        photo: images,
      }

      if (isEditing) {
        const updatedPost = await updatePost(post.slug, postData)
        toast({
          title: "Post updated",
          description: "Your post has been updated successfully",
        })
        router.push(`/posts/${updatedPost.slug}`)
      } else {
        const newPost = await createPost(postData)
        toast({
          title: "Post created",
          description: "Your post has been created successfully",
        })
        router.push(`/posts/${newPost.slug}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Content</Label>
        <Tabs defaultValue="edit" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-0">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your post content here... (Markdown supported)"
              className="min-h-[300px]"
              required
            />
          </TabsContent>
          <TabsContent value="preview" className="mt-0">
            <div className="min-h-[300px] p-4 border rounded-md prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{description}</ReactMarkdown>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => {
            const value = e.target.value;
            // Allow typing # but don't duplicate it
            setTags(value.replace(/,\s*#/g, ',').replace(/##/g, '#'));
          }}
          placeholder="#technology, #programming, #web"
        />
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {images.map((image, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardContent className="p-0">
                <div className="relative h-32 w-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="border-dashed">
            <CardContent className="p-0">
              <label className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-secondary/10 transition-colors">
                {isUploading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload Image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || isUploading}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? "Updating..." : "Creating..."}
          </>
        ) : (
          <>{isEditing ? "Update Post" : "Create Post"}</>
        )}
      </Button>
    </form>
  )
}

