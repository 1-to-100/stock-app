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

export type ApiUser = {
    id: number | number;
    firstName: string;
    lastName: string;
    email: string;
    customerId?: number;
    customer?: Customer
    roleId?: number;
    role?: Role
    persona?: string;
    status: string;
    avatar?: string;
    createdAt?: string;
    managerId?: number;
    activity?: {
        id: number
        browserOs: string
        locationTime: string
    }[]
}
