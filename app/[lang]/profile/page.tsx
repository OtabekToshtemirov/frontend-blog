"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { useTranslation } from "@/hooks/use-translation"
import { getMe, updateProfile, deleteAccount } from "@/lib/api/auth"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { t, language } = useTranslation()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getMe()
        setFullname(userData.fullname)
        setEmail(userData.email)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updateData: { fullname?: string; email?: string; password?: string } = {}
      if (fullname !== user?.fullname) updateData.fullname = fullname
      if (email !== user?.email) updateData.email = email
      if (password) updateData.password = password

      if (Object.keys(updateData).length === 0) {
        toast({
          description: t('no_changes'),
        })
        return
      }

      await updateProfile(updateData)
      toast({
        description: t('profile_updated'),
      })
      setPassword("")
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : t('update_failed'),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await deleteAccount()
      await logout()
      router.push(`/${language}`)
      toast({
        description: t('account_deleted'),
      })
    } catch (error) {
      toast({
        title: "Error",
        description: t('delete_failed'),
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">{t('profile')}</h1>
        <p className="text-muted-foreground">{isEditing ? t('update_profile') : t('profile_info')}</p>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullname">{t('fullname')}</Label>
            <Input
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('new_password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password_placeholder')}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setIsEditing(false)
                setPassword("")
                // Reset form to original values
                setFullname(user?.fullname || "")
                setEmail(user?.email || "")
              }}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('saving')}
                </>
              ) : (
                t('save_changes')
              )}
            </Button>
          </div>
        </form>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t('fullname')}</p>
                  <p className="text-lg">{fullname}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">{t('email')}</p>
                <p className="text-lg">{email}</p>
              </div>

              <div className="pt-6 border-t">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      {t('delete_account')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('delete_confirm')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('delete_warning')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? t('deleting') : t('confirm')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}