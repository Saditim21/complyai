import type { DiscoveryGroup } from './types'

export const DISCOVERY_GROUPS: DiscoveryGroup[] = [
  {
    id: 'employment',
    name: 'Employment & HR',
    icon: 'Users',
    options: [
      {
        id: 'cv_screening',
        category: 'recruitment_screening',
        label: 'CV/Resume screening',
        description: 'Software that screens, ranks, or filters job applications',
        defaultName: 'Applicant Tracking System',
        keywords: ['recruitment', 'cv', 'resume', 'screening', 'hiring', 'ats', 'candidate'],
      },
      {
        id: 'performance_eval',
        category: 'performance_evaluation',
        label: 'Performance evaluation',
        description: 'AI tools for employee performance evaluation or monitoring',
        defaultName: 'Performance Management System',
        keywords: ['performance', 'evaluation', 'monitoring', 'employee', 'productivity'],
      },
      {
        id: 'scheduling',
        category: 'task_allocation',
        label: 'Automated scheduling',
        description: 'Automated scheduling, shift planning, or task assignment',
        defaultName: 'Workforce Scheduling Tool',
        keywords: ['scheduling', 'shift', 'task', 'allocation', 'workforce'],
      },
    ],
  },
  {
    id: 'customer_service',
    name: 'Customer Service',
    icon: 'MessageCircle',
    options: [
      {
        id: 'chatbot',
        category: 'chatbot',
        label: 'Customer service chatbot',
        description: 'Chatbots on your website or messaging channels',
        defaultName: 'Customer Service Chatbot',
        keywords: ['chatbot', 'customer service', 'conversational', 'support'],
      },
      {
        id: 'email_ai',
        category: 'email_automation',
        label: 'AI email responses',
        description: 'AI-powered email response or ticket routing tools',
        defaultName: 'Email Automation Tool',
        keywords: ['email', 'ticket', 'response', 'automation'],
      },
    ],
  },
  {
    id: 'content_marketing',
    name: 'Content & Marketing',
    icon: 'PenTool',
    options: [
      {
        id: 'content_generation',
        category: 'content_generation',
        label: 'AI content generation',
        description: 'AI content generation tools (ChatGPT, Jasper, Claude, etc.)',
        defaultName: 'AI Content Generator',
        keywords: ['content', 'generation', 'writing', 'chatgpt', 'jasper', 'claude'],
      },
      {
        id: 'recommendations',
        category: 'recommendation_engine',
        label: 'Product recommendations',
        description: 'AI-powered product recommendations on your website',
        defaultName: 'Product Recommendation Engine',
        keywords: ['recommendation', 'product', 'personalization', 'ecommerce'],
      },
      {
        id: 'ad_targeting',
        category: 'ad_targeting',
        label: 'Ad targeting',
        description: 'AI-powered advertising targeting or optimization',
        defaultName: 'Ad Targeting System',
        keywords: ['advertising', 'targeting', 'marketing', 'campaign'],
      },
    ],
  },
  {
    id: 'finance',
    name: 'Finance & Insurance',
    icon: 'CreditCard',
    options: [
      {
        id: 'credit_scoring',
        category: 'credit_scoring',
        label: 'Credit scoring',
        description: 'AI credit scoring or creditworthiness assessment',
        defaultName: 'Credit Scoring System',
        keywords: ['credit', 'scoring', 'loan', 'creditworthiness', 'lending'],
      },
      {
        id: 'insurance_pricing',
        category: 'insurance',
        label: 'Insurance pricing',
        description: 'Automated insurance risk assessment or pricing',
        defaultName: 'Insurance Pricing Tool',
        keywords: ['insurance', 'pricing', 'risk', 'underwriting'],
      },
      {
        id: 'fraud_detection',
        category: 'fraud_detection',
        label: 'Fraud detection',
        description: 'AI-powered fraud detection systems',
        defaultName: 'Fraud Detection System',
        keywords: ['fraud', 'detection', 'anomaly', 'suspicious'],
      },
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    icon: 'Settings',
    options: [
      {
        id: 'quality_inspection',
        category: 'quality_control',
        label: 'Quality inspection',
        description: 'AI-powered quality inspection (cameras, sensors)',
        defaultName: 'Quality Inspection System',
        keywords: ['quality', 'inspection', 'defect', 'camera', 'vision'],
      },
      {
        id: 'predictive_maintenance',
        category: 'predictive_maintenance',
        label: 'Predictive maintenance',
        description: 'Predictive maintenance systems for equipment',
        defaultName: 'Predictive Maintenance Tool',
        keywords: ['predictive', 'maintenance', 'equipment', 'failure'],
      },
    ],
  },
  {
    id: 'general',
    name: 'General Tools',
    icon: 'Sparkles',
    options: [
      {
        id: 'coding_assistant',
        category: 'coding_assistant',
        label: 'AI coding assistants',
        description: 'AI coding assistants (GitHub Copilot, Cursor, etc.)',
        defaultName: 'AI Coding Assistant',
        keywords: ['coding', 'copilot', 'cursor', 'programming', 'development'],
      },
      {
        id: 'document_analysis',
        category: 'document_analysis',
        label: 'Document analysis',
        description: 'AI document analysis, summarization, or extraction',
        defaultName: 'Document Analysis Tool',
        keywords: ['document', 'analysis', 'summarization', 'extraction', 'ocr'],
      },
      {
        id: 'translation',
        category: 'translation',
        label: 'AI translation',
        description: 'AI-powered translation tools',
        defaultName: 'AI Translation Tool',
        keywords: ['translation', 'language', 'localization'],
      },
    ],
  },
]

export function getOptionById(id: string): DiscoveryGroup['options'][0] | undefined {
  for (const group of DISCOVERY_GROUPS) {
    const option = group.options.find((o) => o.id === id)
    if (option) return option
  }
  return undefined
}
