"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { PenSquare, LogOut, User, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useAuth } from "@/context/auth-context"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/context/language-context"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function MobileMenu() {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const { language } = useLanguage()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t('menu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle>{t('menu')}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || ""} alt={user.fullname} />
                  <AvatarFallback>{user.fullname.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.fullname}</span>
              </div>
              <Accordion type="single" collapsible>
                <AccordionItem value="actions">
                  <AccordionTrigger>{t('actions')}</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <Link href={`/${language}/profile`} className="flex items-center gap-2 text-sm py-2 px-3 rounded-md hover:bg-accent">
                      <User className="h-4 w-4" />
                      {t('profile')}
                    </Link>
                    <Link href={`/${language}/create`} className="flex items-center gap-2 text-sm py-2 px-3 rounded-md hover:bg-accent">
                      <PenSquare className="h-4 w-4" />
                      {t('new_post')}
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 text-sm py-2 px-3 rounded-md hover:bg-accent w-full text-left text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('logout')}
                    </button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="space-y-2">
              <Button asChild variant="default" className="w-full">
                <Link href={`/${language}/login`}>{t('login')}</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/${language}/register`}>{t('register')}</Link>
              </Button>
            </div>
          )}

          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('theme')}</span>
              <ModeToggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('language')}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}