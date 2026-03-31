'use client'

import { usePathname } from 'next/navigation'

interface HeaderProps {
  organizationName?: string
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/inventory': 'AI Systems',
  '/dashboard/inventory/new': 'Add AI System',
  '/dashboard/roadmap': 'Compliance Roadmap',
  '/dashboard/documents': 'Documents',
  '/dashboard/settings': 'Settings',
}

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname]
  }

  if (pathname.startsWith('/dashboard/inventory/') && pathname !== '/dashboard/inventory/new') {
    return 'AI System Details'
  }
  if (pathname.startsWith('/dashboard/documents/')) {
    return 'Document'
  }

  return 'Dashboard'
}

export function Header({ organizationName }: HeaderProps): React.ReactElement {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8">
      <h1 className="pl-12 text-lg font-semibold text-slate-900 lg:pl-0">{title}</h1>
      {organizationName && (
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm text-slate-500">{organizationName}</span>
        </div>
      )}
    </header>
  )
}
