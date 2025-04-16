import { apiFetch } from './api-fetch';
import { Customer } from '@/lib/api/customers';
import { Role } from '@/lib/api/roles';

export interface ApiUser {
  managerId: any;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  customerId?: number;
  customer?: Customer;
  roleId?: number;
  role?: Role;
  persona?: string;
  status: string;
  avatar?: string;
  createdAt?: string;
  activity?: {
    id: number;
    browserOs: string;
    locationTime: string;
  }[];
}

export interface User {
  id: number;
  name: string;
  email: string | string[];
  customer: string;
  role: string;
  persona: string;
  status: string;
  avatar?: string;
  activity?: { id: number; browserOs: string; locationTime: string }[];
}

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

interface GetUsersParams {
  page?: number;
  perPage?: number;
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

interface GetUsersResponse {
  data: ApiUser[]; // Changed from User[] to ApiUser[]
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

  return apiFetch<GetUsersResponse>(`${API_URL}/users?${query.toString()}`, {
    method: 'GET',
  });
}

export async function getUserById(id: number): Promise<ApiUser> {
  return apiFetch<ApiUser>(`${API_URL}/users/${id}`, {
    method: 'GET',
  });
}