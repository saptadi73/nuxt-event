import { useApi, type ApiResponse } from '~/composables/useApi';

export type AttendanceCheckInType = 'qr' | 'manual' | 'staff';

export interface AttendanceScanPayload {
  qr_token: string;
  event_id: string;
  gate_name?: string;
  device_id?: string;
}

export interface AttendanceManualPayload {
  ticket_number: string;
  event_id: string;
  gate_name?: string;
  device_id?: string;
}

export interface AttendanceRegistrant {
  registration_id?: string;
  event_id?: string;
  registration_number?: string;
  registration_status?: string;
  participant_id?: string;
  participant_name?: string;
  organization_name?: string;
  ticket_id?: string;
  ticket_number?: string;
  is_checked_in?: boolean;
  check_in_at?: string | null;
  gate_name?: string | null;
  status?: string;
  has_ticket?: boolean;
  attendance_status?: string;
}

export interface AttendanceCheckInRecord {
  id?: string;
  ticket_id?: string;
  event_id?: string;
  check_in_type?: AttendanceCheckInType;
  check_in_at?: string;
  check_in_by?: string;
  gate_name?: string | null;
  device_id?: string | null;
  status?: string;
  notes?: string | null;
}

export interface AttendanceScanResponse {
  check_in?: AttendanceCheckInRecord;
  registrant?: AttendanceRegistrant;
}

export interface AttendanceSummary {
  total_registrations?: number;
  checked_in?: number;
  pending?: number;
  no_ticket?: number;
  attendance_rate?: number;
  total_participants?: number;
  total_checked_in?: number;
  total_without_ticket?: number;
}

export interface AttendanceReportResponse {
  summary?: AttendanceSummary;
  registrants?: AttendanceRegistrant[];
  rows?: AttendanceRegistrant[];
  items?: AttendanceRegistrant[];
  [key: string]: unknown;
}

export function useAttendance() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const scanAttendance = (payload: AttendanceScanPayload) =>
    api<ApiResponse<AttendanceScanResponse>>('/attendance/scan', {
      method: 'POST',
      body: payload
    });

  const manualCheckIn = (payload: AttendanceManualPayload) =>
    api<ApiResponse<AttendanceScanResponse>>('/check-ins/manual', {
      method: 'POST',
      body: payload
    });

  const getEventAttendanceReport = (eventId: string, includeWithoutTicket = true) => {
    const query = new URLSearchParams({ include_without_ticket: String(includeWithoutTicket) });
    return api<ApiResponse<AttendanceReportResponse>>(`/attendance/events/${encodeURIComponent(eventId)}/report?${query.toString()}`);
  };

  const getRegistrationRoster = (eventId: string, registrationId: string) =>
    api<ApiResponse<Record<string, unknown>>>(`/attendance/events/${encodeURIComponent(eventId)}/roster/${encodeURIComponent(registrationId)}`);

  return {
    scanAttendance,
    manualCheckIn,
    getEventAttendanceReport,
    getRegistrationRoster
  };
}
