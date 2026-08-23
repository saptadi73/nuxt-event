import type { useApi, ApiResponse } from '~/composables/useApi';

export interface ConversationCreatePayload { participant_id: string; initial_message?: string | null }
export interface ConversationItem { id: string; event_id: string; archived_at?: string | null; unread_count?: number }
export interface MessageItem { id: string; conversation_id: string; message?: string; body?: string; created_at?: string }
export interface NotificationItem { id: string; title?: string; message?: string; body?: string; entity_type?: string; entity_id?: string; is_read?: boolean; created_at?: string; read_at?: string }

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
  const getAdminNotifications = (eventId: string, requestLimit = 100) => api<ApiResponse<NotificationItem[]>>('/admin/notifications', {
    query: { event_id: eventId, request_limit: requestLimit }
  });
  const getAdminUnreadCount = (eventId: string) => api<ApiResponse<{ unread_count: number }>>('/admin/notifications/unread-count', {
    query: { event_id: eventId }
  });
  const markAdminNotificationRead = (notificationId: string, eventId: string) => api<ApiResponse<NotificationItem>>(`/admin/notifications/${notificationId}/read`, {
    method: 'POST',
    query: { event_id: eventId }
  });
  const markAllAdminNotificationsRead = (eventId: string) => api<ApiResponse<null>>('/admin/notifications/read-all', {
    method: 'POST',
    query: { event_id: eventId }
  });
  const getInboxUnreadCount = (eventId?: string) => eventId
    ? api<ApiResponse<{ messages: number; notifications: number; unread_count: number }>>('/inbox/unread-count', { query: { event_id: eventId } })
    : api<ApiResponse<{ messages: number; notifications: number; unread_count: number }>>('/inbox/unread-count');
  return {
    getConversations,
    createConversation,
    getMessages,
    sendMessage,
    markConversationRead,
    archiveConversation,
    getNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    getAdminNotifications,
    getAdminUnreadCount,
    markAdminNotificationRead,
    markAllAdminNotificationsRead,
    getInboxUnreadCount
  };
}
