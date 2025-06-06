"use client"
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
  { code: 'es', label: 'Español' },
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  
  // Extract locale from pathname - now always present due to 'always' prefix
  const segments = pathname.split('/')
  const currentLocale = segments[1] || 'en'

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value
    
    // Replace the locale segment in the URL
    const newSegments = [...segments]
    newSegments[1] = newLocale
    const newPath = newSegments.join('/') || `/${newLocale}`
    
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-2">
      <select
        className="border rounded px-2 py-1 text-sm bg-white shadow"
        value={currentLocale}
        onChange={handleChange}
        aria-label="Select language"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.label}</option>
        ))}
      </select>
      <span className="text-xs text-gray-400">({currentLocale})</span>
    </div>
  )
} 