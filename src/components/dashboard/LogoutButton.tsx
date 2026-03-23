'use client'

import { useState } from 'react'
import { LogOut } from 'lucide-react'

export function LogoutButton(): React.ReactElement {
  const [isPending, setIsPending] = useState(false)

  const handleLogout = async (): Promise<void> => {
    setIsPending(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B2B5A] disabled:opacity-50"
      aria-label="Sign out"
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
