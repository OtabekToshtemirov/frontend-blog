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
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslation } from "@/hooks/use-translation"
import { validateAndCleanTags } from "@/lib/utils"

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
  const [isAnonymous, setIsAnonymous] = useState(post?.anonymous || false)
  const { t } = useTranslation()

  useEffect(() => {
    if (!user) {
      toast({
        title: t('auth_required'),
        description: t('login_to_create_post'),
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user, router, toast, t])

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
        title: t('image_uploaded'),
        description: t('image_upload_success'),
      })
    } catch (error) {
      toast({
        title: t('upload_failed'),
        description: t('image_upload_error'),
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
        title: t('missing_fields'),
        description: t('fill_required_fields'),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const cleanedTags = validateAndCleanTags(tags);
      
      const postData = {
        title: title.trim(),
        description: description.trim(),
        tags: cleanedTags,
        photo: images,
        anonymous: isAnonymous,
      }

      if (isEditing && post) {
        const updatedPost = await updatePost(post.slug, postData)
        toast({
          title: t('success'),
          description: t('post_updated'),
        })
        router.push(`/posts/${updatedPost.slug}`)
      } else {
        const newPost = await createPost(postData)
        toast({
          title: t('success'),
          description: t('post_created'),
        })
        router.push(`/posts/${newPost.slug}`)
      }
    } catch (error: any) {
      let errorMessage = t('general_error');
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors
          .map((err: any) => t(err.message))
          .join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: t('error'),
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
        <Label htmlFor="title">{t('post_title')}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('title_placeholder')}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('post_content')}</Label>
        <Tabs defaultValue="edit" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-2">
            <TabsTrigger value="edit">{t('edit_tab')}</TabsTrigger>
            <TabsTrigger value="preview">{t('preview_tab')}</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-0">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('content_placeholder')}
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
        <Label htmlFor="tags">{t('post_tags')}</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => {
            const value = e.target.value;
            setTags(value.replace(/,\s*#/g, ',').replace(/##/g, '#'));
          }}
          placeholder={t('tags_placeholder')}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('upload_image')}</Label>
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
                    alt={`${t('upload_image')} ${index + 1}`}
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
                    <span className="text-sm text-muted-foreground">{t('uploading')}</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">{t('upload_button')}</span>
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

      <div className="flex items-center space-x-2">
        <Checkbox
          id="anonymous"
          checked={isAnonymous}
          onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
        />
        <Label htmlFor="anonymous" className="text-sm cursor-pointer">
          {t('post_anonymously')}
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || isUploading}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? t('updating_post') : t('creating_post')}
          </>
        ) : (
          <>{isEditing ? t('update_button') : t('create_button')}</>
        )}
      </Button>
    </form>
  )
}

