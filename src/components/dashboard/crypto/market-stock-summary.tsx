'use client';

import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { CurrencyBtc as CurrencyBtcIcon } from '@phosphor-icons/react/dist/ssr/CurrencyBtc';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { NoSsr } from '@/components/core/no-ssr';

export interface DataPoint {
  high: number;
  low: number;
  open: number;
  close: number;
  timestamp: string;
}

interface DataPointNormalized extends Omit<DataPoint, 'open' | 'close'> {
  openClose: [DataPoint['open'], DataPoint['close']];
}

function prepareData(data: DataPoint[]): DataPointNormalized[] {
  return data.map(({ open, close, ...other }): DataPointNormalized => ({ ...other, openClose: [open, close] }));
}

export interface MarketStockSummaryProps {
  data: DataPoint[];
}

export function MarketStockSummary({ data: dataRaw = [] }: MarketStockSummaryProps): React.JSX.Element {
  const chartHeight = 280;

  const data = prepareData(dataRaw);

  const minValue = data.reduce((prevMin: number | null, { low, openClose: [open, close] }): number => {
    const currentMin = Math.min(low, open, close);
    return prevMin === null || currentMin < prevMin ? currentMin : prevMin;
  }, null);

  const maxValue = data.reduce((prevMax, { high, openClose: [open, close] }): number => {
    const currentMax = Math.max(high, open, close);
    // @ts-expect-error -- null compare results in false
    return currentMax > prevMax ? currentMax : prevMax;
  }, minValue);

  const yAxisDomain = minValue !== null && maxValue !== null ? [minValue, maxValue] : undefined;

  return (
    <Card>
      <Typography level="h4">Stock Summary</Typography>
      <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flex: '1 1 auto' }}>
          <Avatar
            color="warning"
            sx={{
              '--Avatar-size': '40px',
              '--Avatar-radius': 'var(--joy-radius-sm)',
              '--Icon-fontSize': 'var(--joy-fontSize-xl)',
            }}
          >
            <CurrencyBtcIcon fontSize="var(--Icon-fontSize)" weight="bold" />
          </Avatar>
          <div>
            <Typography level="title-md">Bitcoin</Typography>
            <Typography level="body-xs">BTC to USD</Typography>
          </div>
        </Stack>
        <Stack spacing={0.5}>
          <Typography level="body-xs">Current Price</Typography>
          <Typography level="h4">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(30205.7)}
          </Typography>
        </Stack>
        <Stack spacing={0.5}>
          <Typography level="body-xs">Change</Typography>
          <Typography level="h4">
            + {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(5.21 / 100)}
          </Typography>
        </Stack>
        <Stack spacing={0.5}>
          <Typography level="body-xs">Volume</Typography>
          <Typography level="h4">$35B</Typography>
        </Stack>
      </Stack>
      <NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
        <ResponsiveContainer height={chartHeight}>
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -60 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="timestamp"
              fontFamily="var(--joy-fontFamily-body)"
              fontSize="var(--joy-fontSize-xs)"
              interval={2}
              tickCount={31}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              dataKey="high"
              domain={yAxisDomain}
              tickCount={8}
              tickFormatter={(): string => ''}
              tickLine={false}
            />
            <Bar
              dataKey="openClose"
              maxBarSize={80}
              // @ts-expect-error -- Bar adds the props
              shape={<Candlestick />}
            />
            <Tooltip animationDuration={50} content={<TooltipContent />} cursor={false} />
          </BarChart>
        </ResponsiveContainer>
      </NoSsr>
    </Card>
  );
}

interface CandestickProps {
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
  low: number;
  high: number;
  openClose: [number, number];
}

function Candlestick({ x, y, width, height, low, high, openClose: [open, close] }: CandestickProps): React.JSX.Element {
  const isGrowing = open < close;
  const color = isGrowing ? 'var(--joy-palette-success-400)' : 'var(--joy-palette-danger-400)';
  const ratio = Math.abs(height / (open - close));

  return (
    <g fill={color} stroke={color} strokeWidth={2}>
      <path
        d={`
          M ${x},${y}
          L ${x},${y + height}
          L ${x + width},${y + height}
          L ${x + width},${y}
          L ${x},${y}
        `}
      />
      {/* bottom line */}
      {isGrowing ? (
        <path
          d={`
            M ${x + width / 2}, ${y + height}
            v ${(open - low) * ratio}
          `}
        />
      ) : (
        <path
          d={`
            M ${x + width / 2}, ${y}
            v ${(close - low) * ratio}
          `}
        />
      )}
      {/* top line */}
      {isGrowing ? (
        <path
          d={`
            M ${x + width / 2}, ${y}
            v ${(close - high) * ratio}
          `}
        />
      ) : (
        <path
          d={`
            M ${x + width / 2}, ${y + height}
            v ${(open - high) * ratio}
          `}
        />
      )}
    </g>
  );
}

interface TooltipContentProps {
  active?: boolean;
  payload?: {
    name: string;
    payload: { fill: string; openClose: [number, number]; high: number; low: number; timestamp: number };
    value: [number, number];
  }[];
}

function TooltipContent({ active, payload }: TooltipContentProps): React.JSX.Element | null {
  if (!active) {
    return null;
  }

  return (
    <Sheet
      sx={{
        boxShadow: 'var(--joy-shadow-lg)',
        borderRadius: 'var(--joy-radius-sm)',
        border: '1px solid var(--joy-palette-neutral-outlinedBorder)',
        p: 1,
      }}
    >
      {payload?.map(
        (entry): React.JSX.Element => (
          <Stack key={entry.name} spacing={1}>
            <Typography level="title-md">{entry.payload.timestamp}</Typography>
            {(
              [
                { label: 'Open', value: entry.payload.openClose[0] },
                { label: 'Close', value: entry.payload.openClose[0] },
                { label: 'Low', value: entry.payload.low },
                { label: 'High', value: entry.payload.high },
              ] satisfies { label: string; value: number }[]
            ).map(
              (item): React.JSX.Element => (
                <Stack
                  direction="row"
                  key={item.label}
                  spacing={3}
                  sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Typography fontSize="sm" fontWeight="md" whiteSpace="nowrap">
                    {item.label}
                  </Typography>
                  <Typography fontSize="sm" textColor="text.tertiary">
                    {item.value}
                  </Typography>
                </Stack>
              )
            )}
          </Stack>
        )
      )}
    </Sheet>
  );
}
