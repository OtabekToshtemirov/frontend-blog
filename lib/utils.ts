import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Language } from "./constants"
import { translations } from "./translations"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: Date | string, language: Language): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const t = translations[language]

  if (days > 0) {
    return (t.days_ago as (n: number) => string)(days)
  } else if (hours > 0) {
    return (t.hours_ago as (n: number) => string)(hours)
  } else if (minutes > 0) {
    return (t.minutes_ago as (n: number) => string)(minutes)
  }
  return t.just_now as string
}

export function formatCount(n: number, key: 'n_likes' | 'n_comments' | 'n_views', language: Language): string {
  const formatter = translations[language][key] as (n: number) => string
  return formatter(n)
}

// Authentication token utilities
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  const expiration = localStorage.getItem('tokenExpiration');
  
  if (!token || !expiration) return null;

  const expirationTime = parseInt(expiration);
  const currentTime = new Date().getTime();

  if (currentTime > expirationTime) {
    // Token has expired
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    return null;
  }

  return token;
}

export function validateAndCleanTags(tags: string | string[]): string[] {
  if (typeof tags === 'string') {
    // Split by comma and clean each tag
    return tags
      .split(',')
      .map(tag => tag.trim().replace(/^#/, '')) // Remove # from start if exists
      .filter(tag => tag.length > 0);
  } else if (Array.isArray(tags)) {
    // Clean each tag in array
    return tags
      .map(tag => tag.toString().trim().replace(/^#/, ''))
      .filter(tag => tag.length > 0);
  }
  return [];
}
