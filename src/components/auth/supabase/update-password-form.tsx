'use client';

import {useCallback, useState} from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/joy/Alert';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import IconButton from '@mui/joy/IconButton';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';
import {useCheckSessionInvite} from "@/components/auth/supabase/check-session-invite";
import {config} from "@/config";

const schema = zod
  .object({
    password: zod.string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(100, { message: 'Password must be less than 100 characters' })
      .regex(/^(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/^(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/^(?=.*\d)/, { message: 'Password must contain at least one number' })
      .regex(/^[^\s]*$/, { message: 'Password cannot contain spaces' }),
    confirmPassword: zod.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type Values = zod.infer<typeof schema>;

const defaultValues = { password: '', confirmPassword: '' } satisfies Values;

export function UpdatePasswordForm({title}: {title?: string}) {
  const {message, supabaseClient} = useCheckSessionInvite();
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const titleForm = title || 'Update Password';

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { error } = await supabaseClient.auth.updateUser({ password: values.password });

      if (error) {
        setError('root', { type: 'server', message: error.message });
        setIsPending(false);
        return;
      }

      await supabaseClient.auth.signOut();
      const redirectUrl = new URL(paths.auth.supabase.signIn, config.site.url);
      redirectUrl.searchParams.set('message', 'Password updated successfully. Please sign in again.');
      window.location.href = redirectUrl.href;
      // чомусь пуста біла стоірнка при router.replace або router.push
      // router.replace(`${paths.auth.supabase.signIn}?message=${encodeURIComponent('Password updated successfully. Please sign in again.')}`);
    },
    [supabaseClient, router, setError]
  );

  if(message) {
    return null;
  }

  return (
    <Stack spacing={5}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
          <DynamicLogo colorDark="light" colorLight="dark" height={32} width={154} />
        </Box>
      </Box>
      <Stack spacing={3}>
        <Typography level="h3" textAlign="center">
          {titleForm}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.password)}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    endDecorator={
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        variant="plain"
                        color="neutral"
                      >
                        {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                      </IconButton>
                    }
                  />
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormControl error={Boolean(errors.confirmPassword)}>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    {...field}
                    type={showConfirmPassword ? 'text' : 'password'}
                    endDecorator={
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        variant="plain"
                        color="neutral"
                      >
                        {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                      </IconButton>
                    }
                  />
                  {errors.confirmPassword ? <FormHelperText>{errors.confirmPassword.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {errors.root ? <Alert color="danger">{errors.root.message}</Alert> : null}
            <Button disabled={isPending} type="submit">
              Update Password
            </Button>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
}
