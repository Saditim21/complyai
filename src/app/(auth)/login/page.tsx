'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/shared/Logo'

type FormState = 'idle' | 'submitting' | 'error'

function LoginForm(): React.ReactElement {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (formState === 'submitting') return

    setFormState('submitting')
    setErrorMessage('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setFormState('error')
      setErrorMessage(
        error.message === 'Invalid login credentials'
          ? 'Incorrect email or password.'
          : error.message
      )
      return
    }

  const next = searchParams.get('next') ?? '/dashboard'
  window.location.href = next
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (formState === 'error') setFormState('idle')
          }}
          required
          autoComplete="email"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1B2B5A] focus:outline-none focus:ring-2 focus:ring-[#1B2B5A]/20"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-slate-500 transition-colors duration-150 hover:text-slate-700"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (formState === 'error') setFormState('idle')
          }}
          required
          autoComplete="current-password"
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
        {formState === 'submitting' ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

function LoginFormFallback(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
        <div className="mt-1 h-11 w-full animate-pulse rounded-lg bg-slate-200" />
      </div>
      <div>
        <div className="h-5 w-16 animate-pulse rounded bg-slate-200" />
        <div className="mt-1 h-11 w-full animate-pulse rounded-lg bg-slate-200" />
      </div>
      <div className="mt-2 h-12 w-full animate-pulse rounded-lg bg-slate-200" />
    </div>
  )
}

export default function LoginPage(): React.ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to your ClarionAI account</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-[#1B2B5A] transition-colors duration-150 hover:text-[#2A3F7A]"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
