export interface ClinicalQueryResponse {
  nameAr: string;
  nameEn: string;
  category: string;
  definition: string;
  symptomsAndSigns?: string;
  nursingCarePlan: string[];
  dosagesAndPrecautions?: string;
  criticalAlert: string;
}

export interface OsceSkill {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  description: string;
  steps: string[];
}

export interface SbarReport {
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  urgentNotes?: string;
}

export interface ClinicalCase {
  caseTitle: string;
  patientProfile?: string;
  vitals: string;
  description: string;
  evaluation?: string;
  options: string[];
  isResolved?: boolean;
}

export interface StaticTerm {
  keywords: string;
  nameEn: string;
  nameAr: string;
  category: string;
  definition: string;
  nursingCare: string;
}
