import { redirect } from 'next/navigation'
import { Check, ExternalLink, AlertCircle } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { getUserWithOrganization, getAISystemStats } from '@/lib/supabase/queries'
import { PLANS, getPlanByTier, formatPrice, type SubscriptionTier } from '@/lib/stripe/plans'
import { BillingActions } from '@/components/dashboard/BillingActions'
import { SettingsAlert } from '@/components/dashboard/SettingsAlert'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>
}): Promise<React.ReactElement> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/dashboard/settings')
  }

  const { data: userData, error } = await getUserWithOrganization(supabase, user.id)

  if (error || !userData?.organization) {
    redirect('/dashboard')
  }

  const org = userData.organization
  const currentTier = (org.subscription_tier ?? 'free') as SubscriptionTier
  const currentPlan = getPlanByTier(currentTier)

  // Get usage stats
  const { data: stats } = await getAISystemStats(supabase, org.id)
  const aiSystemCount = stats?.total ?? 0

  const params = await searchParams

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your organization and subscription
        </p>
      </div>

      <SettingsAlert
        success={params.success === 'true'}
        canceled={params.canceled === 'true'}
      />

      {/* Organization Details */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-slate-900">Organization</h2>
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Organization Name</label>
              <p className="mt-1 text-slate-900">{org.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Country</label>
              <p className="mt-1 text-slate-900">{org.country}</p>
            </div>
            {org.sector && (
              <div>
                <label className="text-sm font-medium text-slate-700">Sector</label>
                <p className="mt-1 text-slate-900">{org.sector}</p>
              </div>
            )}
            {org.employee_count && (
              <div>
                <label className="text-sm font-medium text-slate-700">Employee Count</label>
                <p className="mt-1 text-slate-900">{org.employee_count}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Current Plan */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-slate-900">Current Plan</h2>
            <p className="mt-1 text-sm text-slate-600">
              {currentPlan?.description ?? 'Manage your subscription'}
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-[#1B2B5A] px-3 py-1 text-sm font-medium text-white">
            {currentPlan?.name ?? 'Free'}
          </span>
        </div>

        {/* Usage */}
        <div className="mt-6 rounded-lg bg-slate-50 p-4">
          <h3 className="text-sm font-medium text-slate-700">Usage</h3>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">AI Systems</span>
              <span className="text-sm font-medium text-slate-900">
                {aiSystemCount} / {currentPlan?.features.maxAISystems === -1 ? 'Unlimited' : currentPlan?.features.maxAISystems ?? 1}
              </span>
            </div>
            {currentPlan && currentPlan.features.maxAISystems !== -1 && (
              <div className="mt-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-[#0D9488] transition-all"
                    style={{
                      width: `${Math.min(100, (aiSystemCount / currentPlan.features.maxAISystems) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Feature List */}
          <div className="mt-4 space-y-2">
            <FeatureItem
              enabled={currentPlan?.features.documentExport ?? false}
              label="Document export"
            />
            <FeatureItem
              enabled={currentPlan?.features.fullDocs ?? false}
              label="Full documentation suite"
            />
            <FeatureItem
              enabled={currentPlan?.features.teamMembers ?? false}
              label="Team members"
            />
            <FeatureItem
              enabled={currentPlan?.features.prioritySupport ?? false}
              label="Priority support"
            />
          </div>
        </div>

        <BillingActions
          currentTier={currentTier}
          hasStripeCustomer={!!org.stripe_customer_id}
        />
      </section>

      {/* Available Plans */}
      {currentTier === 'free' && (
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-slate-900">Upgrade Your Plan</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.filter((plan) => plan.tier !== 'free').map((plan) => (
              <PlanCard
                key={plan.tier}
                plan={plan}
              />
            ))}
          </div>
        </section>
      )}

      {/* Danger Zone */}
      <section className="rounded-xl border border-red-200 bg-white p-6">
        <h2 className="text-lg font-medium text-red-700">Danger Zone</h2>
        <p className="mt-1 text-sm text-slate-600">
          Irreversible actions that affect your account
        </p>
        <div className="mt-4 flex items-center gap-4">
          <button
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            type="button"
          >
            Delete Organization
          </button>
        </div>
      </section>
    </div>
  )
}

interface FeatureItemProps {
  enabled: boolean
  label: string
}

function FeatureItem({ enabled, label }: FeatureItemProps): React.ReactElement {
  return (
    <div className="flex items-center gap-2">
      {enabled ? (
        <Check className="h-4 w-4 text-[#0D9488]" />
      ) : (
        <AlertCircle className="h-4 w-4 text-slate-400" />
      )}
      <span className={enabled ? 'text-sm text-slate-900' : 'text-sm text-slate-500'}>
        {label}
      </span>
    </div>
  )
}

interface PlanCardProps {
  plan: (typeof PLANS)[number]
}

function PlanCard({ plan }: PlanCardProps): React.ReactElement {
  const yearlySavings = (plan.priceMonthly * 12) - plan.priceYearly

  return (
    <div
      className={`relative rounded-xl border p-5 ${
        plan.highlighted
          ? 'border-[#0D9488] bg-white ring-1 ring-[#0D9488]'
          : 'border-slate-200 bg-white'
      }`}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0D9488] px-3 py-0.5 text-xs font-medium text-white">
          Most Popular
        </span>
      )}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold text-slate-900">
            {formatPrice(plan.priceMonthly)}
          </span>
          <span className="text-sm text-slate-600">/month</span>
        </div>
        {yearlySavings > 0 && (
          <p className="mt-1 text-xs text-[#0D9488]">
            Save {formatPrice(yearlySavings)}/year with annual billing
          </p>
        )}
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex items-center gap-2">
          <Check className="h-4 w-4 text-[#0D9488]" />
          <span>
            {plan.features.maxAISystems === -1
              ? 'Unlimited AI systems'
              : `${plan.features.maxAISystems} AI systems`}
          </span>
        </li>
        {plan.features.documentExport && (
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[#0D9488]" />
            <span>Document export</span>
          </li>
        )}
        {plan.features.fullDocs && (
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[#0D9488]" />
            <span>Full documentation</span>
          </li>
        )}
        {plan.features.teamMembers && (
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[#0D9488]" />
            <span>Team members</span>
          </li>
        )}
        {plan.features.prioritySupport && (
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[#0D9488]" />
            <span>Priority support</span>
          </li>
        )}
      </ul>
      <form action={`/api/checkout`} method="POST" className="mt-4">
        <input type="hidden" name="tier" value={plan.tier} />
        <input type="hidden" name="billingPeriod" value="monthly" />
        <UpgradeButton tier={plan.tier} highlighted={plan.highlighted} />
      </form>
    </div>
  )
}

interface UpgradeButtonProps {
  tier: string
  highlighted: boolean
}

function UpgradeButton({ tier, highlighted }: UpgradeButtonProps): React.ReactElement {
  return (
    <a
      href={`#upgrade-${tier}`}
      className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        highlighted
          ? 'bg-[#0D9488] text-white hover:bg-[#14B8A6]'
          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      Upgrade
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  )
}
