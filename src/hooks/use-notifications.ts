import { useEffect, useMemo } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import {createClient as createSupabaseClient} from "@/lib/supabase/client";
import {useUserInfo} from "@/hooks/use-user-info";
import {useQuery} from "@tanstack/react-query";
import {unreadNotificationsCount} from "@/lib/api/notifications";

export function useUnreadNotificationsChannel(
  handleNotification: (payload: {count: number}) => void
): void {
  const supabaseClient = useMemo<SupabaseClient>(() => createSupabaseClient(), []);
  const { userInfo } = useUserInfo();
  const { data: unreadCountPayload } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: unreadNotificationsCount,
  });

  useEffect(() => {
    if (!userInfo) return;

    const channel = supabaseClient.channel(`unread-notifications:${userInfo.id}`)
      .on('broadcast', { event: 'unread_count' }, ({ payload }) => {
        if(payload && payload.count !== undefined) {
          handleNotification({ count: payload.count });
        }
      })
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel).then();
    };
  }, [userInfo, supabaseClient, handleNotification]);

  useEffect(() => {
    if (unreadCountPayload && unreadCountPayload?.count !== undefined) {
      handleNotification({ count: unreadCountPayload.count });
    }
  }, [unreadCountPayload, handleNotification]);
}