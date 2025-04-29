import type {User} from '@/types/user';
import {Customer} from '@/lib/api/customers';
import {Role} from '@/lib/api/roles';

export interface UserContextValue {
    user: User | null;
    error: string | null;
    isLoading: boolean;
    checkSession?: () => Promise<void>;
    updateUser?: (user: User) => void;
    syncUser?: () => void;
    role?: string | null;
    permissions?: string[];
}

export interface ApiUser {
    managerId: number;
    id: number;
    firstName: string;
    lastName: string;
    name: string;
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

  export interface Role {
    id: number;
    name: string;
    description: string | null;
    permissions: PermissionsByModule; 
    _count: {
      users: number;
    };
  }

  export interface Customer {
    id: number;
    name: string;
    email: string,
    subscriptionId: number,
    managerId: number,
    numberOfUsers?: number,
    status: string,
    subscriptionName: string,
    manager: {
      id: number;
      name: string;
      email: string;
    }
  }

  export type Status = 'active' | 'inactive' | 'suspended';