import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="mx-auto max-w-md text-center">
        {/* 404 illustration */}
        <div className="relative mx-auto h-40 w-40">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl font-bold text-slate-200">404</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white p-4 shadow-lg">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
          </div>
        </div>

        <h1 className="mt-8 text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B2B5A] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2A3F7A] sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Go to home
          </Link>
          <button
            onClick={() => typeof window !== 'undefined' && window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Need help?{' '}
          <Link href="mailto:support@clarionai.eu" className="font-medium text-[#0D9488] hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}
