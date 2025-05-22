'use client';

import {ReactNode, useEffect, useState} from "react";
import type {SupabaseClient} from "@supabase/supabase-js";
import {createClient as createSupabaseClient} from "@/lib/supabase/client";
import Alert from "@mui/joy/Alert";

export const CheckSessionInvite = ({children}: { children: ReactNode }) => {
  const [supabaseClient] = useState<SupabaseClient>(createSupabaseClient());
  const [message, setMessage] = useState<string | null>('');

  useEffect(() => {
    supabaseClient.auth.getSession().then((data) => {
      setMessage(data?.data?.session ? null : 'Invalid or expired invitation link. Please request a new invitation.');
      console.log('xxx', data);
    });
  }, [supabaseClient]);

  return message === null ? <>{children}</> : message === '' ? <></> : <Alert>{message}</Alert>;
}