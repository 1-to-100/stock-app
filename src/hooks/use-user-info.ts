import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth/user-context';
import { getUserInfo } from '@/lib/api/users';

export const useUserInfo = () => {
  const { user } = useAuth();

  const { data: userInfo, isLoading: isUserLoading, error } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getUserInfo(),
  });

  return { userInfo, isUserLoading, error };
};