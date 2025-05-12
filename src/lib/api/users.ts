import { apiFetch } from './api-fetch';
import { ApiUser, Status } from '@/contexts/auth/types';



interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  customerId?: number;
  roleId?: number;
  managerId?: number;
  status?: 'active' | 'inactive';
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
  data: ApiUser[]; 
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

export async function createUser(payload: CreateUserPayload): Promise<ApiUser> {
  return apiFetch<ApiUser>(`${API_URL}/users`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateUser(payload: UpdateUserPayload): Promise<ApiUser> {
  return apiFetch<ApiUser>(`${API_URL}/users/${payload.id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function getUsers(params: GetUsersParams = {}): Promise<GetUsersResponse> {
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

  return apiFetch<GetUsersResponse>(`${API_URL}/users?${query.toString()}`, {
    method: 'GET',
  });
}

export async function getUserById(id: number): Promise<ApiUser> {
  return apiFetch<ApiUser>(`${API_URL}/users/${id}`, {
    method: 'GET',
  });
}

export async function getUserInfo(): Promise<ApiUser> {
  return apiFetch<ApiUser>(`${API_URL}/users/me`, {
    method: 'GET',
  });
}

export async function editUserInfo(payload: EditUserInfoPayload): Promise<ApiUser> {
  return apiFetch<ApiUser>(`${API_URL}/users/me`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function getStatuses(): Promise<Status[]> {
  return apiFetch<Status[]>(`${API_URL}/taxonomies/statuses`, {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  });
}