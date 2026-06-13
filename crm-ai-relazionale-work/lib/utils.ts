import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format, parseISO } from 'date-fns'
import { it } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, fmt = 'dd/MM/yyyy') {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt, { locale: it })
}

export function timeAgo(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: it })
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    Lead: 'bg-gray-100 text-gray-700',
    Prospect: 'bg-blue-100 text-blue-700',
    Interessato: 'bg-yellow-100 text-yellow-700',
    Cliente: 'bg-green-100 text-green-700',
    Partner: 'bg-purple-100 text-purple-700',
    Collaboratore: 'bg-indigo-100 text-indigo-700',
    Ambassador: 'bg-pink-100 text-pink-700',
    Inattivo: 'bg-gray-100 text-gray-400',
    Archiviato: 'bg-red-50 text-red-400',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

export function priorityColor(priority: string): string {
  return { high: 'text-red-600', medium: 'text-yellow-600', low: 'text-gray-500' }[priority] ?? 'text-gray-500'
}

export function interestBar(level: number): string {
  if (level >= 8) return 'bg-green-500'
  if (level >= 5) return 'bg-yellow-400'
  return 'bg-gray-300'
}

export function currencyFormat(value: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()
}
