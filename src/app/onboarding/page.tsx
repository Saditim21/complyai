'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/shared/Logo'

type FormState = 'idle' | 'submitting' | 'error'

export default function OnboardingPage(): React.ReactElement {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (formState === 'submitting') return

    setFormState('submitting')
    setErrorMessage('')

    const res = await fetch('/api/auth/complete-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, company_name: companyName }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { error?: string }
      setFormState('error')
      setErrorMessage(data.error ?? 'Something went wrong. Please try again.')
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">Complete your profile</h1>
          <p className="mt-2 text-sm text-slate-500">
            Tell us about yourself and your company to get started.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1B2B5A] focus:outline-none focus:ring-2 focus:ring-[#1B2B5A]/20"
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">
                Company name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                autoComplete="organization"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1B2B5A] focus:outline-none focus:ring-2 focus:ring-[#1B2B5A]/20"
              />
            </div>

            {formState === 'error' && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={formState === 'submitting'}
              className="mt-2 w-full rounded-lg bg-[#1B2B5A] px-4 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#2A3F7A] focus:outline-none focus:ring-2 focus:ring-[#1B2B5A] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {formState === 'submitting' ? 'Setting up…' : 'Continue to dashboard'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
