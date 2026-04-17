import { getPlanFeatures, type SubscriptionTier } from './plans'

export interface TierPermissions {
  canAddAISystem: boolean
  canExportDocuments: boolean
  canGenerateFullDocs: boolean
  canAddTeamMembers: boolean
  hasWhiteLabel: boolean
  hasPrioritySupport: boolean
  aiSystemsRemaining: number | null // null means unlimited
}

export function getTierPermissions(
  tier: SubscriptionTier,
  currentAISystemCount: number
): TierPermissions {
  const features = getPlanFeatures(tier)

  const aiSystemsRemaining =
    features.maxAISystems === -1
      ? null
      : Math.max(0, features.maxAISystems - currentAISystemCount)

  return {
    canAddAISystem:
      features.maxAISystems === -1 || currentAISystemCount < features.maxAISystems,
    canExportDocuments: features.documentExport,
    canGenerateFullDocs: features.fullDocs,
    canAddTeamMembers: features.teamMembers,
    hasWhiteLabel: features.whiteLabel,
    hasPrioritySupport: features.prioritySupport,
    aiSystemsRemaining,
  }
}

export function getUpgradeMessage(tier: SubscriptionTier, feature: keyof TierPermissions): string {
  const messages: Record<keyof TierPermissions, string> = {
    canAddAISystem: 'Upgrade your plan to add more AI systems.',
    canExportDocuments: 'Upgrade to Starter or higher to export documents.',
    canGenerateFullDocs: 'Upgrade to Business or higher for full documentation.',
    canAddTeamMembers: 'Upgrade to Business or higher to add team members.',
    hasWhiteLabel: 'Upgrade to Pro for white-label features.',
    hasPrioritySupport: 'Upgrade to Pro for priority support.',
    aiSystemsRemaining: 'Upgrade your plan to add more AI systems.',
  }

  return messages[feature]
}

export function getRecommendedTier(
  currentTier: SubscriptionTier,
  feature: keyof TierPermissions
): SubscriptionTier {
  const tierRequirements: Record<keyof TierPermissions, SubscriptionTier> = {
    canAddAISystem: currentTier === 'free' ? 'starter' : currentTier === 'starter' ? 'business' : 'pro',
    canExportDocuments: 'starter',
    canGenerateFullDocs: 'business',
    canAddTeamMembers: 'business',
    hasWhiteLabel: 'pro',
    hasPrioritySupport: 'pro',
    aiSystemsRemaining: currentTier === 'free' ? 'starter' : currentTier === 'starter' ? 'business' : 'pro',
  }

  return tierRequirements[feature]
}
