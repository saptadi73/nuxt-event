import { useApi, type ApiResponse } from '~/composables/useApi';

export interface RegistrationPayload {
  event_id: string;
  participant_id: string;
  ticket_type_id: string | null;
  dietary_preference?: string;
  accessibility_requirements?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  consent_snapshot?: string;
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
    api<ApiResponse<RegistrationItem>>('/registrations', {
      method: 'POST',
      body: payload
    });

  const getRegistration = (registrationId: string) =>
    api<ApiResponse<RegistrationItem>>(`/registrations/${registrationId}`);

  return {
    createRegistration,
    getRegistration
  };
}
