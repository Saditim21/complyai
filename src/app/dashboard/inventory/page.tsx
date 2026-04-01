import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Cpu } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { getAISystems, getUserByAuthId } from '@/lib/supabase/queries'
import { SystemsTable } from '@/components/dashboard/SystemsTable'
import { InventoryFilters } from '@/components/dashboard/InventoryFilters'
import type { RiskLevel, AISystem } from '@/types/database'

interface InventoryPageProps {
  searchParams: Promise<{ q?: string; risk?: string }>
}

function filterSystems(
  systems: AISystem[],
  searchQuery: string,
  riskFilter: string
): AISystem[] {
  let filtered = systems

  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (system) =>
        system.name.toLowerCase().includes(query) ||
        system.vendor?.toLowerCase().includes(query) ||
        system.category.toLowerCase().includes(query)
    )
  }

  if (riskFilter && riskFilter !== 'all') {
    filtered = filtered.filter(
      (system) => system.risk_level === (riskFilter as RiskLevel)
    )
  }

  return filtered
}

export default async function InventoryPage({ searchParams }: InventoryPageProps): Promise<React.ReactElement> {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login?next=/dashboard/inventory')
  }

  const { data: dbUser } = await getUserByAuthId(supabase, authUser.id)

  if (!dbUser?.organization_id) {
    redirect('/login')
  }

  const { data: systems } = await getAISystems(supabase, dbUser.organization_id)
  const allSystems = systems ?? []

  const params = await searchParams
  const searchQuery = params.q ?? ''
  const riskFilter = params.risk ?? ''

  const filteredSystems = filterSystems(allSystems, searchQuery, riskFilter)
  const hasFilters = Boolean(searchQuery || riskFilter)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">AI Systems Inventory</h1>
          <p className="mt-1 text-slate-500">
            {allSystems.length === 0
              ? 'No AI systems added yet'
              : `${allSystems.length} system${allSystems.length === 1 ? '' : 's'} in your inventory`}
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

      {allSystems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Cpu className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-slate-900">No AI systems yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Start your assessment to discover what AI your organization uses. Our guided wizard will help you identify and classify your AI systems.
          </p>
          <Link
            href="/dashboard/inventory/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[--brand-primary] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[--brand-primary-light]"
          >
            <Plus className="h-4 w-4" />
            Start your AI assessment
          </Link>
        </div>
      ) : (
        <>
          <InventoryFilters searchQuery={searchQuery} riskFilter={riskFilter} />

          {filteredSystems.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">
                No systems match your filters.{' '}
                <Link
                  href="/dashboard/inventory"
                  className="font-medium text-[--brand-primary] hover:underline"
                >
                  Clear filters
                </Link>
              </p>
            </div>
          ) : (
            <>
              {hasFilters && (
                <p className="text-sm text-slate-500">
                  Showing {filteredSystems.length} of {allSystems.length} systems
                </p>
              )}
              <SystemsTable systems={filteredSystems} />
            </>
          )}
        </>
      )}
    </div>
  )
}
