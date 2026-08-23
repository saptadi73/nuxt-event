import type { ApiResponse } from '~/composables/useApi';

export interface EmailNotificationTemplate {
  id: string;
  event_id: string;
  trigger: string;
  subject_template: string;
  body_template: string;
  is_enabled: boolean;
  available_variables: string[];
  created_at?: string;
  updated_at?: string;
}

export interface EmailDeliveryItem {
  id: string;
  trigger: string;
  recipient: string;
  subject: string;
  entity_type?: string | null;
  entity_id?: string | null;
  status: string;
  error_message?: string | null;
  sent_at?: string | null;
  created_at: string;
}

export interface EmailPreview {
  subject: string;
  body: string;
}

export interface EmailTestResult {
  sent: boolean;
}

export interface EmailAccountPreference {
  event_id: string;
  user_id: string;
  trigger: string;
  global_enabled: boolean;
  override_enabled: boolean | null;
  effective_enabled: boolean;
  updated_by?: string | null;
  updated_at?: string | null;
}

export type EmailTemplatePayload = Pick<EmailNotificationTemplate, 'subject_template' | 'body_template' | 'is_enabled'>;

export function useEmailNotifications() {
  const api = useApi();
  const base = (eventId: string) => `/admin/events/${encodeURIComponent(eventId)}/email-notifications`;

  const getTemplates = (eventId: string) =>
    api<ApiResponse<EmailNotificationTemplate[]>>(base(eventId));
  const updateTemplate = (eventId: string, trigger: string, body: EmailTemplatePayload) =>
    api<ApiResponse<EmailNotificationTemplate>>(`${base(eventId)}/${encodeURIComponent(trigger)}`, { method: 'PUT', body });
  const previewTemplate = (eventId: string, trigger: string, variables: Record<string, string> = {}) =>
    api<ApiResponse<EmailPreview>>(`${base(eventId)}/${encodeURIComponent(trigger)}/preview`, { method: 'POST', body: { variables } });
  const sendTest = (eventId: string, trigger: string, recipient: string, variables: Record<string, string> = {}) =>
    api<ApiResponse<EmailTestResult>>(`${base(eventId)}/${encodeURIComponent(trigger)}/test-send`, { method: 'POST', body: { recipient, variables } });
  const getDeliveryHistory = (eventId: string, limit = 100) =>
    api<ApiResponse<EmailDeliveryItem[]>>(`${base(eventId)}/logs/history`, { query: { limit: Math.min(Math.max(limit, 1), 500) } });
  const getAccountPreferences = (eventId: string, userId: string) =>
    api<ApiResponse<EmailAccountPreference[]>>(`${base(eventId)}/accounts/${encodeURIComponent(userId)}/preferences`);
  const updateAccountPreference = (eventId: string, userId: string, trigger: string, isEnabled: boolean | null) =>
    api<ApiResponse<EmailAccountPreference>>(`${base(eventId)}/accounts/${encodeURIComponent(userId)}/preferences/${encodeURIComponent(trigger)}`, { method: 'PUT', body: { is_enabled: isEnabled } });

  return { getTemplates, updateTemplate, previewTemplate, sendTest, getDeliveryHistory, getAccountPreferences, updateAccountPreference };
}
