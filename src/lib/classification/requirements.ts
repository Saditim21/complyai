import type { RiskLevel } from '@/types/classification'

export interface RequirementDefinition {
  id: string
  articleReference: string
  type: string
  title: string
  description: string
  applicableRiskLevels: RiskLevel[]
}

export const COMPLIANCE_REQUIREMENTS: RequirementDefinition[] = [
  // High-risk requirements (Art. 9-15)
  {
    id: 'risk_management_system',
    articleReference: 'Art. 9',
    type: 'risk_management',
    title: 'Risk Management System',
    description: 'Establish, implement, document and maintain a risk management system throughout the AI system lifecycle.',
    applicableRiskLevels: ['high'],
  },
  {
    id: 'data_governance',
    articleReference: 'Art. 10',
    type: 'data_governance',
    title: 'Data and Data Governance',
    description: 'Ensure training, validation and testing data sets are relevant, representative, free of errors and complete.',
    applicableRiskLevels: ['high'],
  },
  {
    id: 'technical_documentation',
    articleReference: 'Art. 11, Annex IV',
    type: 'documentation',
    title: 'Technical Documentation',
    description: 'Draw up technical documentation demonstrating compliance before system is placed on the market.',
    applicableRiskLevels: ['high'],
  },
  {
    id: 'record_keeping',
    articleReference: 'Art. 12',
    type: 'documentation',
    title: 'Record-Keeping and Logging',
    description: 'Enable automatic recording of events (logs) throughout the system lifetime for traceability.',
    applicableRiskLevels: ['high'],
  },
  {
    id: 'transparency_high',
    articleReference: 'Art. 13',
    type: 'transparency',
    title: 'Transparency and Information',
    description: 'Ensure the system is designed to enable users to interpret outputs and use appropriately.',
    applicableRiskLevels: ['high'],
  },
  {
    id: 'human_oversight',
    articleReference: 'Art. 14',
    type: 'human_oversight',
    title: 'Human Oversight',
    description: 'Design the system to be effectively overseen by natural persons during use.',
    applicableRiskLevels: ['high'],
  },
  {
    id: 'accuracy_robustness',
    articleReference: 'Art. 15',
    type: 'technical',
    title: 'Accuracy, Robustness and Cybersecurity',
    description: 'Achieve appropriate levels of accuracy, robustness and cybersecurity throughout lifecycle.',
    applicableRiskLevels: ['high'],
  },
  {
    id: 'conformity_assessment',
    articleReference: 'Art. 43',
    type: 'registration',
    title: 'Conformity Assessment',
    description: 'Undergo conformity assessment procedure before placing system on the market.',
    applicableRiskLevels: ['high'],
  },
  {
    id: 'eu_database_registration',
    articleReference: 'Art. 49',
    type: 'registration',
    title: 'EU Database Registration',
    description: 'Register the high-risk AI system in the EU database before placing on market or putting into service.',
    applicableRiskLevels: ['high'],
  },
  {
    id: 'ce_marking',
    articleReference: 'Art. 48',
    type: 'registration',
    title: 'CE Marking',
    description: 'Affix CE marking to indicate conformity with the AI Act requirements.',
    applicableRiskLevels: ['high'],
  },

  // Limited risk requirements (Art. 50)
  {
    id: 'transparency_chatbot',
    articleReference: 'Art. 50(1)',
    type: 'transparency',
    title: 'AI Interaction Disclosure',
    description: 'Inform natural persons that they are interacting with an AI system, unless obvious from circumstances.',
    applicableRiskLevels: ['limited'],
  },
  {
    id: 'synthetic_content_labeling',
    articleReference: 'Art. 50(2)',
    type: 'transparency',
    title: 'Synthetic Content Labeling',
    description: 'Mark AI-generated or manipulated image, audio or video content in a machine-readable format.',
    applicableRiskLevels: ['limited'],
  },
  {
    id: 'emotion_recognition_disclosure',
    articleReference: 'Art. 50(3)',
    type: 'transparency',
    title: 'Emotion Recognition Disclosure',
    description: 'Inform natural persons exposed to emotion recognition or biometric categorisation systems.',
    applicableRiskLevels: ['limited'],
  },

  // Minimal risk (voluntary best practices)
  {
    id: 'voluntary_code_conduct',
    articleReference: 'Art. 95',
    type: 'documentation',
    title: 'Voluntary Codes of Conduct',
    description: 'Consider adhering to voluntary codes of conduct for non-high-risk AI systems.',
    applicableRiskLevels: ['minimal'],
  },
  {
    id: 'general_purpose_ai',
    articleReference: 'Art. 53',
    type: 'documentation',
    title: 'General-Purpose AI Obligations',
    description: 'If using GPAI models, ensure provider compliance with Art. 53 requirements.',
    applicableRiskLevels: ['minimal', 'limited'],
  },
]

export function getRequirementsForRiskLevel(riskLevel: RiskLevel): string[] {
  if (riskLevel === 'unacceptable') {
    return ['Immediately cease deployment. This AI system is prohibited under the EU AI Act.']
  }

  return COMPLIANCE_REQUIREMENTS
    .filter((req) => req.applicableRiskLevels.includes(riskLevel))
    .map((req) => `${req.title} (${req.articleReference}): ${req.description}`)
}

export function getRequirementDefinitions(riskLevel: RiskLevel): RequirementDefinition[] {
  if (riskLevel === 'unacceptable') {
    return []
  }
  return COMPLIANCE_REQUIREMENTS.filter((req) => req.applicableRiskLevels.includes(riskLevel))
}

export function getRequirementById(id: string): RequirementDefinition | undefined {
  return COMPLIANCE_REQUIREMENTS.find((req) => req.id === id)
}

export function getRequirementsByType(type: string): RequirementDefinition[] {
  return COMPLIANCE_REQUIREMENTS.filter((req) => req.type === type)
}

export const REQUIREMENT_TYPES = {
  risk_management: 'Risk Management',
  data_governance: 'Data Governance',
  documentation: 'Documentation',
  transparency: 'Transparency',
  human_oversight: 'Human Oversight',
  technical: 'Technical Requirements',
  registration: 'Registration & Conformity',
} as const
