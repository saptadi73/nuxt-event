import { useApi, type ApiResponse } from '~/composables/useApi';

export interface ConversationCreatePayload { participant_id: string; initial_message?: string | null }
export interface ConversationItem { id: string; event_id: string; archived_at?: string | null; unread_count?: number }
export interface MessageItem { id: string; conversation_id: string; message?: string; body?: string; created_at?: string }
export interface NotificationItem { id: string; title?: string; message?: string; is_read?: boolean; created_at?: string }

export function useCommunication() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;
  const getConversations = (eventId: string) => api<ApiResponse<ConversationItem[]>>(`/events/${eventId}/conversations`);
  const createConversation = (eventId: string, body: ConversationCreatePayload) => api<ApiResponse<ConversationItem>>(`/events/${eventId}/conversations`, { method: 'POST', body });
  const getMessages = (conversationId: string) => api<ApiResponse<MessageItem[]>>(`/conversations/${conversationId}/messages`);
  const sendMessage = (conversationId: string, body: string, replyToMessageId?: string | null) => api<ApiResponse<MessageItem>>(`/conversations/${conversationId}/messages`, { method: 'POST', body: { body, reply_to_message_id: replyToMessageId } });
  const markConversationRead = (conversationId: string) => api<ApiResponse<null>>(`/conversations/${conversationId}/read`, { method: 'POST' });
  const archiveConversation = (conversationId: string) => api<ApiResponse<null>>(`/conversations/${conversationId}/archive`, { method: 'POST' });
  const getNotifications = () => api<ApiResponse<NotificationItem[]>>('/notifications');
  const getUnreadCount = () => api<ApiResponse<{ unread_count: number }>>('/notifications/unread-count');
  const markNotificationRead = (notificationId: string) => api<ApiResponse<NotificationItem>>(`/notifications/${notificationId}/read`, { method: 'POST' });
  const markAllNotificationsRead = () => api<ApiResponse<null>>('/notifications/read-all', { method: 'POST' });
  return { getConversations, createConversation, getMessages, sendMessage, markConversationRead, archiveConversation, getNotifications, getUnreadCount, markNotificationRead, markAllNotificationsRead };
}
