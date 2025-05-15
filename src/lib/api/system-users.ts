import { apiFetch } from './api-fetch';
import { SystemUser } from '@/contexts/auth/types';



interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  customerId?: number;
  roleId?: number;
  managerId?: number;
  status?: 'active' | 'inactive';
  isCustomerSuccess?: boolean;
  isSystemAdmin?: boolean;
}

interface UpdateUserPayload extends Partial<CreateUserPayload> {
  id: number;
}

interface EditUserInfoPayload extends Partial<CreateUserPayload> {
  firstName: string;
  lastName: string;
}

export interface GetUsersParams {
  page?: number;
  perPage?: number;
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  roleId?: number[];
  customerId?: number[];
  statusId?: string[];
}

interface GetUsersResponse {
  data: SystemUser[]; 
  meta: {
    total: number;
    page: number;
    lastPage: number;
    perPage: number;
    currentPage: number;
    prev: number | null;
    next: number | null;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createSystemUser(payload: CreateUserPayload): Promise<SystemUser> {
  return apiFetch<SystemUser>(`${API_URL}/system-users`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateSystemUser(payload: UpdateUserPayload): Promise<SystemUser> {
  return apiFetch<SystemUser>(`${API_URL}/system-users/${payload.id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function getSystemUsers(params: GetUsersParams = {}): Promise<GetUsersResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page.toString());
  if (params.perPage) query.set('perPage', params.perPage.toString());
  if (params.search) query.set('search', params.search);
  if (params.orderBy) query.set('orderBy', params.orderBy);
  if (params.orderDirection) query.set('orderDirection', params.orderDirection);
  
  if (params.roleId && params.roleId.length > 0) {
    params.roleId.forEach(id => query.append('roleId', id.toString()));
  }
  if (params.customerId && params.customerId.length > 0) {
    params.customerId.forEach(id => query.append('customerId', id.toString()));
  }
  if (params.statusId && params.statusId.length > 0) {
    params.statusId.forEach(status => query.append('status', status));
  }

  return apiFetch<GetUsersResponse>(`${API_URL}/system-users?${query.toString()}`, {
    method: 'GET',
  });
}

export async function getSystemUserById(id: number): Promise<SystemUser> {
  return apiFetch<SystemUser>(`${API_URL}/system-users/${id}`, {
    method: 'GET',
  });
}