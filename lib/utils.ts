import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function generateArtisanId(): string {
  return `ART-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateProductId(): string {
  return `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function calculateAuthenticityScore(factors: {
  techniques: number
  materials: number
  cultural: number
  documentation: number
}): number {
  const weights = {
    techniques: 0.3,
    materials: 0.25,
    cultural: 0.25,
    documentation: 0.2
  }
  
  return Math.round(
    factors.techniques * weights.techniques +
    factors.materials * weights.materials +
    factors.cultural * weights.cultural +
    factors.documentation * weights.documentation
  )
}

export function simulateAIProcessing(baseDelay: number = 2000): Promise<void> {
  const delay = baseDelay + Math.random() * 1000 // Add some randomness
  return new Promise(resolve => setTimeout(resolve, delay))
} 