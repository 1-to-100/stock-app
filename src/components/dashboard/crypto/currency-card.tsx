import * as React from 'react';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { CurrencyBtc as CurrencyBtcIcon } from '@phosphor-icons/react/dist/ssr/CurrencyBtc';
import { CurrencyDollar as CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';
import { CurrencyEth as CurrencyEthIcon } from '@phosphor-icons/react/dist/ssr/CurrencyEth';
import { TrendDown as TrendDownIcon } from '@phosphor-icons/react/dist/ssr/TrendDown';
import { TrendUp as TrendUpIcon } from '@phosphor-icons/react/dist/ssr/TrendUp';

export type Coin = 'BTC' | 'ETH' | 'USDT' | 'SOL';

const colorsMapping = { BTC: 'warning', ETH: 'primary', USDT: 'success', SOL: 'neutral' } as Record<
  string,
  'warning' | 'primary' | 'success' | 'neutral'
>;

const iconsMapping = {
  BTC: CurrencyBtcIcon,
  ETH: CurrencyEthIcon,
  USDT: CurrencyDollarIcon,
  SOL: CurrencyBtcIcon,
} as Record<string, Icon>;

export interface WalletCardProps {
  wallet: { coin: string; diff: number; trend: 'up' | 'down'; amount: number; value: number };
}

export function WalletCard({ wallet }: WalletCardProps): React.JSX.Element {
  const { coin, diff, amount, value, trend } = wallet;
  const color = colorsMapping[coin] ?? 'neutral';
  const Icon = iconsMapping[coin] ?? CurrencyBtcIcon;
  const trendColor = trend === 'up' ? 'success' : 'danger';
  const TrendIcon = trend === 'up' ? TrendUpIcon : TrendDownIcon;

  return (
    <Card color={color} sx={{ boxShadow: 'none' }} variant="soft">
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <Icon fontSize="var(--joy-fontSize-lg)" weight="bold" />
        <Typography fontSize="sm" fontWeight="xl" sx={{ flex: '1 1 auto' }}>
          {coin}
        </Typography>
        <Chip
          color={trendColor}
          size="sm"
          startDecorator={<TrendIcon fontSize="var(--Icon-fontSize)" weight="bold" />}
          variant="plain"
        >
          {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(diff / 100)}
        </Chip>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Typography level="h2" sx={{ flex: '1 1 auto' }}>
          {new Intl.NumberFormat('en-US').format(amount)}
        </Typography>
        <Typography level="body-sm">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
        </Typography>
      </Stack>
    </Card>
  );
}
