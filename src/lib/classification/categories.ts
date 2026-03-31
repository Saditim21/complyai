import type { AnnexIIIDomain, ProhibitedPractice, TransparencyObligation, Article6Exception } from '@/types/classification'

export const ANNEX_III_DOMAINS: AnnexIIIDomain[] = [
  {
    id: 'biometrics',
    name: 'Biometrics',
    description: 'AI systems for biometric identification and categorisation of natural persons',
    articleReferences: ['Annex III, 1'],
    subCategories: [
      {
        id: 'remote_biometric_identification',
        name: 'Remote Biometric Identification',
        description: 'AI systems intended for real-time and post remote biometric identification',
        examples: [
          'Facial recognition access control systems',
          'Fingerprint verification for building access',
          'Voice recognition authentication systems',
        ],
        keywords: ['facial recognition', 'biometric', 'fingerprint', 'face detection', 'identity verification', 'voice recognition'],
      },
      {
        id: 'emotion_recognition',
        name: 'Emotion Recognition',
        description: 'AI systems intended to infer emotions or intentions of natural persons based on biometric data',
        examples: [
          'Customer sentiment analysis from facial expressions',
          'Employee stress monitoring systems',
          'Interview emotion analysis tools',
        ],
        keywords: ['emotion', 'sentiment', 'facial expression', 'mood detection', 'stress monitoring', 'feeling'],
      },
      {
        id: 'biometric_categorisation',
        name: 'Biometric Categorisation',
        description: 'AI systems for categorising persons based on biometric data into groups',
        examples: [
          'Age estimation systems',
          'Gender classification tools',
          'Demographic profiling from photos',
        ],
        keywords: ['age estimation', 'gender detection', 'demographic', 'categorisation', 'classification'],
      },
    ],
  },
  {
    id: 'critical_infrastructure',
    name: 'Critical Infrastructure',
    description: 'AI systems used as safety components in management and operation of critical infrastructure',
    articleReferences: ['Annex III, 2'],
    subCategories: [
      {
        id: 'traffic_management',
        name: 'Traffic Management',
        description: 'AI systems managing road traffic and transport networks',
        examples: [
          'Traffic light optimization systems',
          'Fleet routing algorithms',
          'Autonomous vehicle navigation',
        ],
        keywords: ['traffic', 'transport', 'routing', 'navigation', 'fleet', 'logistics', 'vehicle'],
      },
      {
        id: 'utilities',
        name: 'Water, Gas, Heating, Electricity',
        description: 'AI systems managing supply of water, gas, heating and electricity',
        examples: [
          'Smart grid management systems',
          'Energy demand prediction',
          'Water distribution optimization',
        ],
        keywords: ['energy', 'electricity', 'water', 'gas', 'heating', 'utility', 'grid', 'power'],
      },
      {
        id: 'digital_infrastructure',
        name: 'Digital Infrastructure',
        description: 'AI systems managing digital infrastructure and networks',
        examples: [
          'Network security threat detection',
          'Data center load balancing',
          'Cybersecurity incident response',
        ],
        keywords: ['network', 'cybersecurity', 'infrastructure', 'data center', 'server', 'cloud'],
      },
    ],
  },
  {
    id: 'education',
    name: 'Education and Vocational Training',
    description: 'AI systems in education for determining access, assignment, or assessment of persons',
    articleReferences: ['Annex III, 3'],
    subCategories: [
      {
        id: 'admissions',
        name: 'Educational Admissions',
        description: 'AI systems determining access or admission to educational institutions',
        examples: [
          'University application screening tools',
          'Student admission scoring systems',
          'Scholarship eligibility algorithms',
        ],
        keywords: ['admission', 'enrollment', 'application', 'university', 'school', 'acceptance'],
      },
      {
        id: 'assessment',
        name: 'Student Assessment',
        description: 'AI systems for assessing students or evaluating learning outcomes',
        examples: [
          'Automated essay grading systems',
          'Online exam proctoring with AI',
          'Learning outcome prediction tools',
        ],
        keywords: ['grading', 'assessment', 'exam', 'test', 'evaluation', 'score', 'proctoring'],
      },
      {
        id: 'behavior_monitoring',
        name: 'Behavior Monitoring',
        description: 'AI systems for monitoring student behavior during tests or in institutions',
        examples: [
          'Classroom attention monitoring',
          'Cheating detection systems',
          'Student engagement tracking',
        ],
        keywords: ['monitoring', 'behavior', 'attention', 'cheating', 'engagement', 'tracking'],
      },
    ],
  },
  {
    id: 'employment',
    name: 'Employment, Workers Management and Access to Self-Employment',
    description: 'AI systems in employment for recruitment, work allocation, or performance monitoring',
    articleReferences: ['Annex III, 4'],
    subCategories: [
      {
        id: 'recruitment_screening',
        name: 'Recruitment and Screening',
        description: 'AI systems for recruitment, screening, filtering, or evaluating candidates',
        examples: [
          'AI-powered CV/resume screening tools',
          'Candidate ranking algorithms',
          'Video interview analysis systems',
          'Automated candidate matching platforms',
        ],
        keywords: ['recruitment', 'hiring', 'cv', 'resume', 'candidate', 'screening', 'ats', 'applicant tracking'],
      },
      {
        id: 'job_advertising',
        name: 'Job Advertisement Targeting',
        description: 'AI systems for placing targeted job advertisements',
        examples: [
          'LinkedIn job ad targeting',
          'Programmatic job advertising',
          'Candidate sourcing algorithms',
        ],
        keywords: ['job ad', 'advertisement', 'targeting', 'sourcing', 'job posting'],
      },
      {
        id: 'performance_evaluation',
        name: 'Performance Evaluation',
        description: 'AI systems for evaluating work performance and behavior of employees',
        examples: [
          'Employee productivity tracking software',
          'Performance review scoring systems',
          'Keystroke and activity monitoring',
        ],
        keywords: ['performance', 'evaluation', 'productivity', 'monitoring', 'tracking', 'review'],
      },
      {
        id: 'task_allocation',
        name: 'Task Allocation',
        description: 'AI systems for making decisions on promotion, termination, or task allocation',
        examples: [
          'Shift scheduling algorithms',
          'Work assignment optimization',
          'Gig worker task distribution (Uber, Deliveroo)',
        ],
        keywords: ['task', 'allocation', 'scheduling', 'assignment', 'shift', 'promotion', 'termination'],
      },
    ],
  },
  {
    id: 'essential_services',
    name: 'Access to Essential Private Services and Benefits',
    description: 'AI systems evaluating eligibility for essential services, credit, insurance, or emergency services',
    articleReferences: ['Annex III, 5'],
    subCategories: [
      {
        id: 'credit_scoring',
        name: 'Credit Scoring',
        description: 'AI systems evaluating creditworthiness or credit scores',
        examples: [
          'Automated loan approval systems',
          'Credit risk assessment algorithms',
          'Buy-now-pay-later eligibility checks',
        ],
        keywords: ['credit', 'loan', 'scoring', 'creditworthiness', 'lending', 'bnpl', 'financing'],
      },
      {
        id: 'insurance',
        name: 'Insurance Risk and Pricing',
        description: 'AI systems for risk assessment and pricing in life and health insurance',
        examples: [
          'Insurance premium calculation tools',
          'Health risk assessment systems',
          'Claims fraud detection',
        ],
        keywords: ['insurance', 'premium', 'risk', 'health', 'life insurance', 'underwriting', 'claims'],
      },
      {
        id: 'social_benefits',
        name: 'Public Benefits and Services',
        description: 'AI systems evaluating eligibility for public assistance benefits or services',
        examples: [
          'Social benefit eligibility systems',
          'Welfare fraud detection',
          'Housing assistance allocation',
        ],
        keywords: ['benefit', 'welfare', 'social', 'assistance', 'eligibility', 'government', 'public'],
      },
      {
        id: 'emergency_services',
        name: 'Emergency Services Dispatch',
        description: 'AI systems for dispatching or prioritising emergency first response services',
        examples: [
          'Emergency call triage systems',
          '911/112 dispatch prioritization',
          'Ambulance routing optimization',
        ],
        keywords: ['emergency', 'dispatch', '911', '112', 'ambulance', 'fire', 'police', 'triage'],
      },
    ],
  },
  {
    id: 'law_enforcement',
    name: 'Law Enforcement',
    description: 'AI systems used by law enforcement authorities for risk assessment and criminal investigations',
    articleReferences: ['Annex III, 6'],
    subCategories: [
      {
        id: 'risk_assessment',
        name: 'Individual Risk Assessment',
        description: 'AI systems assessing risk of natural persons offending or reoffending',
        examples: [
          'Recidivism prediction tools',
          'Pre-trial risk assessment',
          'Parole decision support systems',
        ],
        keywords: ['recidivism', 'risk assessment', 'offending', 'criminal', 'parole', 'bail'],
      },
      {
        id: 'polygraph',
        name: 'Polygraph and Deception Detection',
        description: 'AI systems intended for use as polygraphs or to detect deception',
        examples: [
          'AI lie detection systems',
          'Deception detection interviews',
          'Truth verification tools',
        ],
        keywords: ['polygraph', 'lie detection', 'deception', 'truth', 'verification'],
      },
      {
        id: 'evidence_evaluation',
        name: 'Evidence Evaluation',
        description: 'AI systems for evaluating reliability of evidence in criminal investigations',
        examples: [
          'Forensic evidence analysis',
          'Digital evidence assessment',
          'Witness credibility scoring',
        ],
        keywords: ['evidence', 'forensic', 'investigation', 'witness', 'credibility'],
      },
      {
        id: 'profiling',
        name: 'Crime Prediction and Profiling',
        description: 'AI systems for profiling persons in the course of criminal offence detection',
        examples: [
          'Predictive policing systems',
          'Criminal profiling algorithms',
          'Hotspot crime prediction',
        ],
        keywords: ['profiling', 'prediction', 'predictive policing', 'crime', 'hotspot'],
      },
    ],
  },
  {
    id: 'migration',
    name: 'Migration, Asylum and Border Control',
    description: 'AI systems for migration and border management decisions',
    articleReferences: ['Annex III, 7'],
    subCategories: [
      {
        id: 'risk_assessment_migration',
        name: 'Migration Risk Assessment',
        description: 'AI systems assessing security or health risks of persons entering a country',
        examples: [
          'Visa application screening',
          'Border crossing risk assessment',
          'Travel authorization systems (ETIAS)',
        ],
        keywords: ['visa', 'border', 'immigration', 'migration', 'asylum', 'entry', 'travel'],
      },
      {
        id: 'document_verification',
        name: 'Document Authenticity Verification',
        description: 'AI systems verifying authenticity of travel documents',
        examples: [
          'Passport verification systems',
          'Document fraud detection',
          'ID authenticity checking',
        ],
        keywords: ['passport', 'document', 'verification', 'authenticity', 'fraud', 'id'],
      },
    ],
  },
  {
    id: 'justice',
    name: 'Administration of Justice and Democratic Processes',
    description: 'AI systems assisting judicial authorities in interpreting facts, law, or legal research',
    articleReferences: ['Annex III, 8'],
    subCategories: [
      {
        id: 'legal_interpretation',
        name: 'Legal Research and Interpretation',
        description: 'AI systems assisting in researching and interpreting facts and the law',
        examples: [
          'Legal research AI assistants',
          'Case law analysis tools',
          'Contract analysis systems',
        ],
        keywords: ['legal', 'law', 'court', 'judicial', 'case', 'contract', 'research'],
      },
      {
        id: 'dispute_resolution',
        name: 'Alternative Dispute Resolution',
        description: 'AI systems used in alternative dispute resolution',
        examples: [
          'Online dispute resolution platforms',
          'Arbitration decision support',
          'Mediation recommendation systems',
        ],
        keywords: ['dispute', 'resolution', 'arbitration', 'mediation', 'settlement'],
      },
      {
        id: 'democratic_processes',
        name: 'Influencing Democratic Processes',
        description: 'AI systems intended to influence voters in elections or referenda',
        examples: [
          'Political ad targeting systems',
          'Voter behavior prediction',
          'Campaign optimization tools',
        ],
        keywords: ['election', 'voting', 'political', 'campaign', 'referendum', 'democracy'],
      },
    ],
  },
]

export const PROHIBITED_PRACTICES: ProhibitedPractice[] = [
  {
    id: 'subliminal',
    name: 'Subliminal Manipulation',
    description: 'AI systems deploying subliminal techniques beyond consciousness to distort behavior',
    articleReference: 'Art. 5(1)(a)',
    keywords: ['subliminal', 'manipulation', 'subconscious', 'beyond consciousness'],
  },
  {
    id: 'exploitation_vulnerability',
    name: 'Exploitation of Vulnerabilities',
    description: 'AI systems exploiting vulnerabilities of specific groups (age, disability, social/economic situation)',
    articleReference: 'Art. 5(1)(b)',
    keywords: ['exploit', 'vulnerability', 'elderly', 'children', 'disabled', 'poverty'],
  },
  {
    id: 'social_scoring',
    name: 'Social Scoring by Public Authorities',
    description: 'AI systems for social scoring by public authorities leading to detrimental treatment',
    articleReference: 'Art. 5(1)(c)',
    keywords: ['social scoring', 'social credit', 'citizen score', 'public authority'],
  },
  {
    id: 'real_time_biometric_public',
    name: 'Real-time Remote Biometric ID in Public Spaces',
    description: 'Real-time remote biometric identification in publicly accessible spaces for law enforcement (with limited exceptions)',
    articleReference: 'Art. 5(1)(d)',
    keywords: ['real-time', 'public space', 'mass surveillance', 'facial recognition public'],
  },
  {
    id: 'predictive_policing_individual',
    name: 'Individual Predictive Policing',
    description: 'AI systems making risk assessments of persons based solely on profiling or personality traits',
    articleReference: 'Art. 5(1)(d)',
    keywords: ['predictive policing', 'individual prediction', 'crime prediction person'],
  },
  {
    id: 'emotion_workplace_education',
    name: 'Emotion Recognition in Workplace/Education',
    description: 'AI systems inferring emotions in workplace or educational institutions (except safety/medical)',
    articleReference: 'Art. 5(1)(f)',
    keywords: ['emotion workplace', 'emotion school', 'emotion employee', 'emotion student'],
  },
  {
    id: 'biometric_categorisation_sensitive',
    name: 'Biometric Categorisation for Sensitive Attributes',
    description: 'AI systems categorising persons based on biometric data to deduce sensitive attributes',
    articleReference: 'Art. 5(1)(g)',
    keywords: ['race', 'religion', 'political', 'sexual orientation', 'biometric sensitive'],
  },
  {
    id: 'facial_recognition_scraping',
    name: 'Untargeted Facial Recognition Database',
    description: 'AI systems creating facial recognition databases through untargeted scraping',
    articleReference: 'Art. 5(1)(e)',
    keywords: ['facial scraping', 'face database', 'untargeted collection', 'clearview'],
  },
]

export const TRANSPARENCY_OBLIGATIONS: TransparencyObligation[] = [
  {
    id: 'chatbot',
    name: 'AI-Human Interaction',
    description: 'AI systems designed to interact with natural persons must disclose AI nature',
    articleReference: 'Art. 50(1)',
    triggers: ['chatbot', 'conversational', 'virtual assistant', 'voice assistant', 'customer service ai'],
  },
  {
    id: 'synthetic_content',
    name: 'Synthetic Content Generation',
    description: 'AI systems generating synthetic audio, image, video or text must label content as AI-generated',
    articleReference: 'Art. 50(2)',
    triggers: ['generate image', 'generate video', 'generate audio', 'deepfake', 'synthetic', 'ai generated content'],
  },
  {
    id: 'emotion_biometric_categorisation',
    name: 'Emotion Recognition / Biometric Categorisation',
    description: 'AI systems for emotion recognition or biometric categorisation must inform persons being exposed',
    articleReference: 'Art. 50(3)',
    triggers: ['emotion recognition', 'sentiment analysis face', 'biometric categorisation'],
  },
]

export const ARTICLE_6_EXCEPTIONS: Article6Exception[] = [
  {
    id: 'narrow_procedural',
    name: 'Narrow Procedural Task',
    description: 'AI performs a narrow procedural task (e.g., converting unstructured data to structured format)',
    articleReference: 'Art. 6(3)(a)',
  },
  {
    id: 'improve_human_activity',
    name: 'Improving Human Activity',
    description: 'AI improves the result of a previously completed human activity',
    articleReference: 'Art. 6(3)(b)',
  },
  {
    id: 'detect_patterns',
    name: 'Pattern Detection Without Replacement',
    description: 'AI detects decision-making patterns without replacing or influencing human assessment',
    articleReference: 'Art. 6(3)(c)',
  },
  {
    id: 'preparatory_task',
    name: 'Preparatory Task',
    description: 'AI performs a preparatory task for an assessment relevant to the use cases in Annex III',
    articleReference: 'Art. 6(3)(d)',
  },
]

export function getDomainById(id: string): AnnexIIIDomain | undefined {
  return ANNEX_III_DOMAINS.find((domain) => domain.id === id)
}

export function getAllSubCategories(): { domain: AnnexIIIDomain; subCategory: typeof ANNEX_III_DOMAINS[0]['subCategories'][0] }[] {
  const result: { domain: AnnexIIIDomain; subCategory: typeof ANNEX_III_DOMAINS[0]['subCategories'][0] }[] = []
  for (const domain of ANNEX_III_DOMAINS) {
    for (const subCategory of domain.subCategories) {
      result.push({ domain, subCategory })
    }
  }
  return result
}
