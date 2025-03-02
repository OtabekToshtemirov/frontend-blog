"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { register } from "@/lib/api/auth"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { useTranslation } from "@/hooks/use-translation"
import { useState } from "react"

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const { t, language } = useTranslation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullname = formData.get("fullname") as string

    try {
      const { user, token } = await register({ email, password, fullname })
      localStorage.setItem("token", token)
      await login(email, password)
      const loginUrl = `/${language}/login`;
      router.replace(loginUrl)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Ensure the t function always returns a string
  const safeT = (key: keyof typeof translations[Language]) => t(key)

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">{safeT('create_account')}</h1>
        <p className="text-muted-foreground">
          {safeT('have_account')}{" "}
          <Button variant="link" className="p-0" asChild>
            <Link href={`/${language}/login`}>{safeT('sign_in')}</Link>
          </Button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullname">{safeT('fullname')}</Label>
          <Input
            id="fullname"
            name="fullname"
            required
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{safeT('email')}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{safeT('password')}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {safeT('sign_up')}...
            </>
          ) : (
            safeT('sign_up')
          )}
        </Button>
      </form>
    </div>
  )
}