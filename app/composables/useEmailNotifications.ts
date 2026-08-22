import type { ApiResponse } from '~/composables/useApi';

export interface EmailNotificationTemplate {
  id?: string;
  event_id?: string;
  notification_type: string;
  name?: string;
  subject: string;
  body_html?: string | null;
  body_text?: string | null;
  is_enabled: boolean;
  available_variables?: string[];
  updated_at?: string;
}

export interface EmailDeliveryItem {
  id: string;
  notification_type?: string;
  recipient_email?: string;
  recipient?: string;
  subject?: string;
  status: string;
  error_message?: string | null;
  sent_at?: string | null;
  created_at?: string;
}

export interface EmailPreview {
  subject: string;
  body_html?: string | null;
  body_text?: string | null;
}

export type EmailTemplatePayload = Pick<EmailNotificationTemplate, 'subject' | 'body_html' | 'body_text' | 'is_enabled'>;

export function useEmailNotifications() {
  const api = useApi();
  const base = (eventId: string) => `/admin/events/${encodeURIComponent(eventId)}/email-notifications`;

  const getTemplates = (eventId: string) =>
    api<ApiResponse<EmailNotificationTemplate[]>>(base(eventId));
  const updateTemplate = (eventId: string, type: string, body: EmailTemplatePayload) =>
    api<ApiResponse<EmailNotificationTemplate>>(`${base(eventId)}/${encodeURIComponent(type)}`, { method: 'PUT', body });
  const previewTemplate = (eventId: string, type: string, body: EmailTemplatePayload) =>
    api<ApiResponse<EmailPreview>>(`${base(eventId)}/${encodeURIComponent(type)}/preview`, { method: 'POST', body });
  const sendTest = (eventId: string, type: string, email: string) =>
    api<ApiResponse<null>>(`${base(eventId)}/${encodeURIComponent(type)}/test-send`, { method: 'POST', body: { email } });
  const getDeliveryHistory = (eventId: string, page = 1, size = 20) =>
    api<ApiResponse<EmailDeliveryItem[]>>(`${base(eventId)}/deliveries?page=${page}&size=${size}`);

  return { getTemplates, updateTemplate, previewTemplate, sendTest, getDeliveryHistory };
}
