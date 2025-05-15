import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthApiError } from '@supabase/supabase-js';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { createClient } from '@/lib/supabase/server';
import { config } from '@/config';

export const dynamic = 'force-dynamic';

// NOTE: If you have a proxy in front of this app
//  the request origin might be a local address.
//  Consider using `config.site.url` from `@/config` instead.

// NOTE: This is not a `Page` because we only redirect and it will never render React content.

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;

  if (searchParams.get('error')) {
    const description = searchParams.get('error_description') || 'Something went wrong';
    const url = new URL(paths.auth.supabase.signUp, config.site.url);
    url.searchParams.set('error', description);
    return NextResponse.redirect(url);
  }

  const code = searchParams.get('code');
  let next = searchParams.get('next');

  if (!code) {
    return NextResponse.json({ error: 'Code is missing' });
  }

  const cookieStore = cookies();
  const supabaseClient = createClient(cookieStore);

  try {
    const { error, data: {user} } = await supabaseClient.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.json({ error: error.message });
    }

    if (!user || !user.email) {
      return NextResponse.json({ error: 'User is missing' });
    }

    const validateEmailUrl = `${config.site.apiUrl}/register/validate-email/${encodeURIComponent(user.email)}`;
    const emailValidationResponse = await fetch(validateEmailUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!emailValidationResponse.ok) {
      await supabaseClient.auth.signOut();

      const errorData = await emailValidationResponse.json();
      const url = new URL(paths.auth.supabase.signUp, config.site.url);
      url.searchParams.set('error', errorData.message || 'Email validation failed');
      return NextResponse.redirect(url);
    }
  } catch (err) {
    if (err instanceof AuthApiError && err.message.includes('code and code verifier should be non-empty')) {
      return NextResponse.json({ error: 'Please open the link in the same browser' });
    }

    logger.error('Callback error', err);

    return NextResponse.json({ error: 'Something went wrong' });
  }


  if (!next) {
    next = paths.home;
  }

  return NextResponse.redirect(new URL(next, config.site.url));
}
