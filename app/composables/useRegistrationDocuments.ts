import { useApi, type ApiResponse } from '~/composables/useApi';

export interface RegistrationDocument { id: string; registration_id: string; document_type?: string; file_name?: string; status?: string; created_at?: string }

export function useRegistrationDocuments() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;
  const getDocuments = (registrationId: string) => api<ApiResponse<RegistrationDocument[]>>(`/registrations/${registrationId}/documents`);
  const uploadDocument = (registrationId: string, file: File, documentType: string) => { const body = new FormData(); body.append('file', file); body.append('document_type', documentType); return api<ApiResponse<RegistrationDocument>>(`/registrations/${registrationId}/documents`, { method: 'POST', body }); };
  const deleteDocument = (registrationId: string, documentId: string) => api<ApiResponse<null>>(`/registrations/${registrationId}/documents/${documentId}`, { method: 'DELETE' });
  const downloadDocument = (registrationId: string, documentId: string) => api<Blob>(`/registrations/${registrationId}/documents/${documentId}/download`, { responseType: 'blob' });
  return { getDocuments, uploadDocument, deleteDocument, downloadDocument };
}
