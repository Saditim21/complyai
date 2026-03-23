'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/shared/Logo'

type FormState = 'idle' | 'submitting' | 'check-email' | 'error'

interface FormFields {
  fullName: string
  companyName: string
  email: string
  password: string
}

export default function SignupPage(): React.ReactElement {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fields, setFields] = useState<FormFields>({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (formState === 'error') setFormState('idle')
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (formState === 'submitting') return
    if (fields.password.length < 8) {
      setFormState('error')
      setErrorMessage('Password must be at least 8 characters.')
      return
    }

    setFormState('submitting')
    setErrorMessage('')

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: fields.email,
      password: fields.password,
      options: {
        data: { full_name: fields.fullName, company_name: fields.companyName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setFormState('error')
      setErrorMessage(error.message)
      return
    }

    if (data.session) {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fields.fullName, company_name: fields.companyName }),
      })
      if (!res.ok) {
        setFormState('error')
        setErrorMessage('Account created but profile setup failed. Please contact support.')
        return
      }
      router.push('/dashboard')
    } else {
      setFormState('check-email')
    }
  }

  if (formState === 'check-email') {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Logo />
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">Check your email</h1>
            <p className="mt-3 text-sm text-slate-600">
              We sent a confirmation link to <strong>{fields.email}</strong>. Click it to activate
              your account.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Start your compliance assessment in minutes
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
                name="fullName"
                type="text"
                value={fields.fullName}
                onChange={handleChange}
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
                name="companyName"
                type="text"
                value={fields.companyName}
                onChange={handleChange}
                required
                autoComplete="organization"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1B2B5A] focus:outline-none focus:ring-2 focus:ring-[#1B2B5A]/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={fields.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1B2B5A] focus:outline-none focus:ring-2 focus:ring-[#1B2B5A]/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={fields.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="At least 8 characters"
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
              {formState === 'submitting' ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-[#1B2B5A] hover:text-[#2A3F7A] transition-colors duration-150"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          By creating an account you agree to our{' '}
          <Link href="/terms" className="underline hover:text-slate-600">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-slate-600">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
