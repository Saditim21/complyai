import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Search } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { getAISystems, getUserByAuthId } from '@/lib/supabase/queries'
import { SystemCard } from '@/components/dashboard/SystemCard'

export default async function InventoryPage(): Promise<React.ReactElement> {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login?next=/dashboard/inventory')
  }

  const { data: dbUser } = await getUserByAuthId(supabase, authUser.id)

  if (!dbUser?.organization_id) {
    redirect('/dashboard')
  }

  const { data: systems } = await getAISystems(supabase, dbUser.organization_id)
  const systemsList = systems ?? []

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">AI Systems Inventory</h1>
          <p className="mt-1 text-slate-500">
            {systemsList.length === 0
              ? 'No AI systems added yet'
              : `${systemsList.length} system${systemsList.length === 1 ? '' : 's'} in your inventory`}
          </p>
        </div>
        <Link
          href="/dashboard/inventory/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[--brand-primary] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[--brand-primary-light]"
        >
          <Plus className="h-4 w-4" />
          Add AI system
        </Link>
      </div>

      {systemsList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Search className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-900">No AI systems yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            Get started by adding your first AI system to begin compliance tracking.
          </p>
          <Link
            href="/dashboard/inventory/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[--brand-primary] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[--brand-primary-light]"
          >
            <Plus className="h-4 w-4" />
            Add your first AI system
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systemsList.map((system) => (
            <SystemCard key={system.id} system={system} />
          ))}
        </div>
      )}
    </div>
  )
}
