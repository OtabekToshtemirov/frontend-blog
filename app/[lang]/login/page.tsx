"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { useTranslation } from "@/hooks/use-translation"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ApiError } from "@/lib/api/auth"

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const { t, language } = useTranslation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Formalarni tozalash
    setFormErrors({})
    setGeneralError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await login(email, password)
      const baseUrl = `/${language}`;
      router.replace(baseUrl)
    } catch (error: any) {
      
      
      // Agar backenddan kelgan api errorda xatolar mavjud bo'lsa, ularni ko'rsatish
      if (error.errors && Array.isArray(error.errors)) {
        // Xatolarni field bo'yicha guruhlash
        const fieldErrors: Record<string, string> = {};
        const generalErrors: string[] = [];
        
        error.errors.forEach((err: {field?: string; message: string}) => {
          if (err.field) {
            fieldErrors[err.field] = err.message;
          } else {
            generalErrors.push(err.message);
          }
        });
        
        setFormErrors(fieldErrors);
        
        if (generalErrors.length > 0) {
          setGeneralError(generalErrors.join(", "));
        }
      } else if (error.response?.data?.errors) {
        // Backend validation errors in axios format
        const backendErrors = error.response.data.errors;
        const fieldErrors: Record<string, string> = {};
        const generalErrors: string[] = [];
        
        backendErrors.forEach((err: {field?: string; message: string}) => {
          if (err.field) {
            fieldErrors[err.field] = err.message;
          } else {
            generalErrors.push(err.message);
          }
        });
        
        setFormErrors(fieldErrors);
        
        if (generalErrors.length > 0) {
          setGeneralError(generalErrors.join(", "));
        }
      } else {
        // Umumiy xatolik xabarini ko'rsatish
        const errorMessage = error.message || t('login_failed');
        setGeneralError(errorMessage);
        
        toast({
          title: t('error'),
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">{t('welcome_back')}</h1>
        <p className="text-muted-foreground">
          {t('no_account')}{" "}
          <Button variant="link" className="p-0" asChild>
            <Link href={`/${language}/register`}>{t('sign_up')}</Link>
          </Button>
        </p>
      </div>

      {generalError && (
        <Alert variant="destructive" className="text-sm">
          <AlertDescription>{generalError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className={formErrors.email ? "text-destructive" : ""}>
            {t('email')}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="hello@example.com"
            required
            autoComplete="email"
            className={formErrors.email ? "border-destructive" : ""}
          />
          {formErrors.email && (
            <p className="text-destructive text-xs mt-1">{formErrors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className={formErrors.password ? "text-destructive" : ""}>
            {t('password')}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={formErrors.password ? "border-destructive" : ""}
          />
          {formErrors.password && (
            <p className="text-destructive text-xs mt-1">{formErrors.password}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('sign_in')}...
            </>
          ) : (
            t('sign_in')
          )}
        </Button>
      </form>
    </div>
  )
}