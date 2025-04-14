import type {User} from '@/types/user';

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
