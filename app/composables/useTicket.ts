import { useApi, type ApiResponse } from '~/composables/useApi';

export interface TicketItem {
  id: string;
  registration_id: string;
  ticket_number: string;
  status: 'issued' | 'revoked' | 'used' | 'pending' | 'cancelled';
}

export interface TicketQr {
  qr_token: string;
  qr_image_url: string;
}

export interface TicketQrResponse {
  success: boolean;
  message: string;
  data: TicketQr;
}

export function useTicket() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const getMyTickets = () =>
    api<ApiResponse<TicketItem[]>>('/tickets/me');

  const getQrByTicket = (ticketId: string) =>
    api<TicketQrResponse>(`/tickets/${ticketId}/qr`);

  const reissueTicket = (ticketId: string) =>
    api<ApiResponse<TicketItem>>(`/tickets/${ticketId}/reissue`, { method: 'POST' });

  return {
    getMyTickets,
    getQrByTicket,
    reissueTicket
  };
}
