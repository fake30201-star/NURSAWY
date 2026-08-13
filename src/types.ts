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

// ===================== الأدلة السريرية المتقدمة =====================

export interface DrugCompatibilityEntry {
  id: string;
  drugA: string;
  drugB: string;
  status: 'compatible' | 'incompatible' | 'caution';
  route: string;
  notes: string;
}

export interface LabValueEntry {
  id: string;
  test: string;
  normalRange: string;
  category: string;
  highMeaning: string;
  lowMeaning: string;
  criticalAction: string;
}

export interface DiagnosticPrepEntry {
  id: string;
  procedure: string;
  category: string;
  beforeCare: string[];
  afterCare: string[];
  alerts: string;
}

export interface IsolationEntry {
  id: string;
  type: string;
  typeEn: string;
  examples: string;
  ppe: string[];
  roomSetup: string;
  doffingOrder: string[];
}

export interface ToxicologyEntry {
  id: string;
  agent: string;
  category: string;
  symptoms: string;
  immediateAction: string;
  antidote: string;
}

// ===================== منظومة الصيدليات =====================

export type UserRole = 'nurse' | 'pharmacy';

export type PharmacyOrderStatus =
  | 'pending'
  | 'priced'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'rejected';

export interface PharmacyProfile {
  id: string;
  full_name: string | null;
  pharmacy_name: string | null;
  pharmacy_phone: string | null;
  pharmacy_address: string | null;
  pharmacy_lat: number | null;
  pharmacy_lng: number | null;
  distanceKm?: number;
}

export interface PharmacyOrder {
  id: string;
  patient_id: string;
  pharmacy_id: string;
  request_text: string | null;
  prescription_url: string | null;
  status: PharmacyOrderStatus;
  price: number | null;
  rep_id: string | null;
  rep_name: string | null;
  rep_phone: string | null;
  patient_lat: number | null;
  patient_lng: number | null;
  patient_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface PharmacyRep {
  id: string;
  pharmacy_id: string;
  full_name: string;
  phone: string;
  created_at: string;
}

export interface PharmacyMessage {
  id: string;
  order_id: string;
  sender_id: string;
  sender_role: 'patient' | 'pharmacy';
  message: string;
  created_at: string;
}

export interface PharmacyRating {
  id: string;
  order_id: string;
  pharmacy_id: string;
  patient_id: string;
  pharmacy_stars: number;
  rep_stars: number | null;
  comment: string | null;
  created_at: string;
}
