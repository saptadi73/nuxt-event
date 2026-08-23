import type { useApi, ApiResponse } from '~/composables/useApi';

export interface RegistrationPayload {
  event_id: string;
  full_name: string;
  job_title: string;
  company_organization: string;
  nationality: string;
  title: string;
  business_sector: string;
  country: string;
  email: string;
  mobile_whatsapp: string;
  office_phone?: string | null;
  company_website?: string | null;
  linkedin?: string | null;
  company_address: string;
  participation_categories: string[];
  presentation_topic?: string | null;
  products_interested?: string | null;
  investment_interest?: string | null;
  room_preference: string;
  preferred_roommate?: string | null;
  arrival_date: string;
  departure_date: string;
  flight_number?: string | null;
  airport: string;
  need_airport_pickup: boolean;
  products_services: string;
  looking_for: string[];
  preferred_countries: string[];
  business_objectives: string;
  activity_ids: string[];
  dietary_restrictions?: string | null;
  medical_condition?: string | null;
  special_assistance?: string | null;
  need_official_invoice: boolean;
  tax_id?: string | null;
  information_accuracy_confirmed: boolean;
  terms_accepted: boolean;
  business_matching_data_consent: boolean;
  terms_version: string;
  consent_version: string;
}

export interface RegistrationItem {
  id: string;
  event_id: string;
  participant_id: string;
  registration_number: string;
  status: 'draft' | 'awaiting_payment' | 'payment_pending' | 'confirmed' | 'canceled' | 'expired' | 'refunded';
  dietary_preference?: string;
  accessibility_requirements?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  confirmed_at?: string | null;
}

export function useRegistration() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const createRegistration = (payload: RegistrationPayload) =>
    api<ApiResponse<RegistrationItem>>(`/events/${payload.event_id}/registrations`, {
      method: 'POST',
      body: Object.fromEntries(Object.entries(payload).filter(([key]) => key !== 'event_id'))
    });

  const getRegistration = (registrationId: string) =>
    api<ApiResponse<RegistrationItem>>(`/registrations/${registrationId}`);

  const getMyRegistrations = (eventId?: string) =>
    api<ApiResponse<RegistrationItem[]>>('/registrations/me', {
      query: eventId ? { event_id: eventId } : undefined
    });

  return {
    createRegistration,
    getRegistration
    ,
    getMyRegistrations
  };
}
