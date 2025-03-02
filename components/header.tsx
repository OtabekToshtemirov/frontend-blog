"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { MobileMenu } from "@/components/mobile-menu"
import { useAuth } from "@/context/auth-context"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/context/language-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PenSquare, LogOut, User } from "lucide-react"

export default function Header() {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const { language } = useLanguage()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={`/${language}`} className="text-2xl font-bold">
          Otablog
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {user && (
            <Button asChild variant="ghost" className="hidden md:flex">
              <Link href={`/${language}/create`}>
                <PenSquare className="mr-2 h-4 w-4" />
                {t("create_post")}
              </Link>
            </Button>
          )}

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || ""} alt={user.fullname} />
                      <AvatarFallback>{user.fullname.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">{user.fullname}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${language}/profile`}>
                      <User className="mr-2 h-4 w-4" />
                      {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${language}/create`}>
                      <PenSquare className="mr-2 h-4 w-4" />
                      {t('new_post')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href={`/${language}/login`}>{t("login")}</Link>
                </Button>
                <Button asChild>
                  <Link href={`/${language}/register`}>{t("register")}</Link>
                </Button>
              </>
            )}
            <LanguageSwitcher />
            <ModeToggle />
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

