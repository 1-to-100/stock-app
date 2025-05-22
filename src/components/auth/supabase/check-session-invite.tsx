'use client';

import {ReactNode, useEffect, useState} from "react";
import type {SupabaseClient} from "@supabase/supabase-js";
import {createClient as createSupabaseClient} from "@/lib/supabase/client";
import Alert from "@mui/joy/Alert";

export const CheckSessionInvite = ({children}: { children: ReactNode }) => {
  const [supabaseClient] = useState<SupabaseClient>(createSupabaseClient());
  const [message, setMessage] = useState<string | null>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    console.log('access_token', access_token);

    supabaseClient.auth.getSession().then((data) => {
      setMessage(data?.data?.session ? null : 'Invalid or expired invitation link. Please request a new invitation.');
      console.log('xxx', data);
    });
  }, [supabaseClient]);

  return message === null ? <>{children}</> : message === '' ? <></> : <Alert>{message}</Alert>;
}