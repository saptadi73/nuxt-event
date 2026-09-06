import type { useApi, ApiResponse } from '~/composables/useApi';

export interface RegistrationPayload {
  event_id: string;
  full_name: string;
  job_title: string;
  company_organization: string;
  nationality: string;
  title: string;
  business_sector: string;
  email: string;
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
  detail?: Partial<RegistrationPayload> & Record<string, unknown>;
}

export function useRegistration() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const createRegistration = (payload: RegistrationPayload) =>
    api<ApiResponse<RegistrationItem>>(`/events/${payload.event_id}/registrations`, {
      method: 'POST',
      body: Object.fromEntries(Object.entries(payload).filter(([key]) => key !== 'event_id'))
    });

  const getRegistration = (registrationId: string, eventId?: string) =>
    api<ApiResponse<RegistrationItem>>(eventId
      ? `/events/${encodeURIComponent(eventId)}/registrations/${encodeURIComponent(registrationId)}`
      : `/registrations/${encodeURIComponent(registrationId)}`);

  const getMyRegistrations = (eventId?: string) =>
    api<ApiResponse<RegistrationItem[]>>('/registrations/me', {
      query: eventId ? { event_id: eventId } : undefined
    });

  const updateRegistration = (eventId: string, registrationId: string, payload: RegistrationPayload) =>
    api<ApiResponse<RegistrationItem>>(`/events/${eventId}/registrations/${registrationId}`, {
      method: 'PATCH',
      body: Object.fromEntries(Object.entries(payload).filter(([key]) => key !== 'event_id'))
    });

  const submitRegistration = (eventId: string, registrationId: string) =>
    api<ApiResponse<{ id: string; status: string }>>(`/events/${encodeURIComponent(eventId)}/registrations/${encodeURIComponent(registrationId)}/submit`, { method: 'POST' });

  const uploadPassport = (registrationId: string, file: File) => {
    const body = new FormData();
    body.append('document_type', 'PASSPORT_COPY');
    body.append('file', file);
    return api<ApiResponse<{ id: string; filename: string }>>(`/registrations/${encodeURIComponent(registrationId)}/documents`, { method: 'POST', body });
  };

  const getRegistrationDocuments = (registrationId: string) =>
    api<ApiResponse<Array<{ id: string; document_type: string; filename: string }>>>(`/registrations/${encodeURIComponent(registrationId)}/documents`);

  return {
    createRegistration,
    getRegistration,
    getMyRegistrations,
    updateRegistration,
    submitRegistration,
    uploadPassport,
    getRegistrationDocuments
  };
}
