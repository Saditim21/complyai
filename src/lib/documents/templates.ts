import type { DocumentTemplate, DocumentType } from '@/types/documents'

export const TECHNICAL_DOCUMENTATION_TEMPLATE: DocumentTemplate = {
  type: 'technical_documentation',
  title: 'Technical Documentation',
  description: 'Comprehensive technical documentation as required by Annex IV of the EU AI Act',
  articleReference: 'Annex IV',
  applicableRiskLevels: ['high'],
  sections: [
    {
      id: 'system_description',
      title: 'General Description of the AI System',
      description: 'A detailed description of the AI system including its intended purpose, the persons or groups of persons on which the system is intended to be used, and the overall interaction of the AI system with hardware and software.',
      isRequired: true,
      articleReference: 'Annex IV, 1(a)',
    },
    {
      id: 'intended_purpose',
      title: 'Intended Purpose and Use Cases',
      description: 'Description of the intended purpose of the AI system, the persons developing the system, the date and version, and how the AI system interacts or can be used to interact with hardware or software.',
      isRequired: true,
      articleReference: 'Annex IV, 1(b)',
    },
    {
      id: 'development_process',
      title: 'Development Process and Methods',
      description: 'Description of the methods and steps performed for the development of the AI system, including data handling, design choices, and the computational and hardware resources used.',
      isRequired: true,
      articleReference: 'Annex IV, 2',
    },
    {
      id: 'data_governance',
      title: 'Data Requirements and Governance',
      description: 'Description of the data requirements in terms of datasheets, training methodologies, data sets used, their provenance, scope, main characteristics, and how the data was obtained and selected.',
      isRequired: true,
      articleReference: 'Annex IV, 2(d)',
    },
    {
      id: 'performance_metrics',
      title: 'Performance Metrics and Benchmarks',
      description: 'Information about the performance of the AI system, including relevant metrics, test results, and benchmarks used to evaluate the system.',
      isRequired: true,
      articleReference: 'Annex IV, 3',
    },
    {
      id: 'human_oversight',
      title: 'Human Oversight Measures',
      description: 'Description of the human oversight measures in place, including technical measures facilitating the interpretation of outputs and enabling human operators to override, interrupt, or stop the AI system.',
      isRequired: true,
      articleReference: 'Annex IV, 4',
    },
  ],
}

export const RISK_MANAGEMENT_TEMPLATE: DocumentTemplate = {
  type: 'risk_management_plan',
  title: 'Risk Management Plan',
  description: 'Risk management system documentation as required by Article 9 of the EU AI Act',
  articleReference: 'Article 9',
  applicableRiskLevels: ['high'],
  sections: [
    {
      id: 'risk_identification',
      title: 'Risk Identification',
      description: 'Identification and analysis of known and reasonably foreseeable risks that the AI system can pose to health, safety, or fundamental rights when used in accordance with its intended purpose.',
      isRequired: true,
      articleReference: 'Art. 9(2)(a)',
    },
    {
      id: 'risk_analysis',
      title: 'Risk Analysis',
      description: 'Estimation and evaluation of the risks that may emerge when the AI system is used in accordance with its intended purpose and under conditions of reasonably foreseeable misuse.',
      isRequired: true,
      articleReference: 'Art. 9(2)(b)',
    },
    {
      id: 'risk_evaluation',
      title: 'Risk Evaluation',
      description: 'Evaluation of other risks possibly arising, based on the analysis of data gathered from the post-market monitoring system.',
      isRequired: true,
      articleReference: 'Art. 9(2)(c)',
    },
    {
      id: 'risk_mitigation',
      title: 'Risk Mitigation Measures',
      description: 'Adoption of appropriate and targeted risk management measures designed to address identified risks, including technical measures, organizational safeguards, and user training requirements.',
      isRequired: true,
      articleReference: 'Art. 9(4)',
    },
  ],
}

export const TRANSPARENCY_NOTICE_TEMPLATE: DocumentTemplate = {
  type: 'transparency_notice',
  title: 'Transparency Notice',
  description: 'Transparency information for users as required by Article 13 of the EU AI Act',
  articleReference: 'Article 13',
  applicableRiskLevels: ['limited', 'high'],
  sections: [
    {
      id: 'system_capabilities',
      title: 'System Capabilities',
      description: 'Clear description of what the AI system can and is designed to do, including its general capabilities, functions, and level of accuracy.',
      isRequired: true,
      articleReference: 'Art. 13(3)(a)',
    },
    {
      id: 'limitations',
      title: 'Known Limitations',
      description: 'Description of the known limitations of the AI system, including reasonably foreseeable circumstances that may lead to risks to health, safety, or fundamental rights.',
      isRequired: true,
      articleReference: 'Art. 13(3)(b)(i)',
    },
    {
      id: 'intended_purpose_transparency',
      title: 'Intended Purpose',
      description: 'Information about the intended purpose and the persons or groups of persons on which the system is intended to be used.',
      isRequired: true,
      articleReference: 'Art. 13(3)(b)(ii)',
    },
    {
      id: 'human_oversight_transparency',
      title: 'Human Oversight',
      description: 'Information about human oversight measures, including technical measures to facilitate interpretation of outputs and enable operators to correctly use the system.',
      isRequired: true,
      articleReference: 'Art. 13(3)(d)',
    },
    {
      id: 'data_processing',
      title: 'Data Processing Information',
      description: 'Information about the types of data processed, data sources, and how data is used by the AI system.',
      isRequired: true,
      articleReference: 'Art. 13(3)(b)(vi)',
    },
  ],
}

export const DOCUMENT_TEMPLATES: Record<DocumentType, DocumentTemplate> = {
  technical_documentation: TECHNICAL_DOCUMENTATION_TEMPLATE,
  risk_management_plan: RISK_MANAGEMENT_TEMPLATE,
  transparency_notice: TRANSPARENCY_NOTICE_TEMPLATE,
}

export function getTemplateForType(type: DocumentType): DocumentTemplate {
  return DOCUMENT_TEMPLATES[type]
}

export function getApplicableTemplates(
  riskLevel: 'minimal' | 'limited' | 'high' | 'unacceptable'
): DocumentTemplate[] {
  return Object.values(DOCUMENT_TEMPLATES).filter((template) =>
    template.applicableRiskLevels.includes(riskLevel)
  )
}

export function formatDocumentTitle(type: DocumentType): string {
  const titles: Record<DocumentType, string> = {
    technical_documentation: 'Technical Documentation',
    risk_management_plan: 'Risk Management Plan',
    transparency_notice: 'Transparency Notice',
  }
  return titles[type]
}
