import * as React from "react";
import type { Metadata } from "next";

import { config } from "@/config";
import { GuestGuard } from "@/components/auth/guest-guard";
import { SplitLayout } from "@/components/auth/split-layout";
import { UpdatePasswordForm } from "@/components/auth/supabase/update-password-form";
import { PageProps } from "@/types/app";

export const metadata = {
  title: `Update password | Supabase | Auth | ${config.site.name}`,
} satisfies Metadata;

export default async function Page({ searchParams }: PageProps) {
  const { token, type } = await searchParams;

  // Якщо є токен для скидання пароля, показуємо форму без AuthGuard
  if (token && type === "recovery") {
    return (
      <GuestGuard>
        <SplitLayout>
          <UpdatePasswordForm resetToken={token as string} />
        </SplitLayout>
      </GuestGuard>
    );
  }

  // Інакше показуємо звичайну форму для авторизованих користувачів
  return (
    <GuestGuard>
      <SplitLayout>
        <UpdatePasswordForm />
      </SplitLayout>
    </GuestGuard>
  );
}
