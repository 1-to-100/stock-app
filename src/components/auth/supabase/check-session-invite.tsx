'use client';

import {ReactNode, useEffect, useState} from "react";
import {createClient as createSupabaseClient} from "@/lib/supabase/client";
import Alert from '@mui/joy/Alert';

export const CheckSessionInvite = ({children}: { children: ReactNode }) => {
  const {message} = useCheckSessionInvite();

  return message === null ? <>{children}</> : message === '' ? <></> : <Alert>{message}</Alert>;
}

export const useCheckSessionInvite = () => {
  const [supabaseClient] = useState(() => createSupabaseClient());
  const [message, setMessage] = useState<string | null>('');

  useEffect(() => {
    const { access_token, refresh_token } = Object.fromEntries(
      new URLSearchParams(window.location.hash.slice(1))
    );

    if (!access_token || !refresh_token) {
      setMessage('Invalid or expired invitation link. Please request a new invitation.');
      return;
    }

    supabaseClient.auth.setSession({ access_token, refresh_token }).then(({ data }) => {
      setMessage(data?.session ? null : 'Invalid or expired invitation link. Please request a new invitation.');
    });
  }, [supabaseClient]);

  return {message, supabaseClient};
};