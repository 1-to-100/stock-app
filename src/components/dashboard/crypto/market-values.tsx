'use client';

import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import {CurrencyBtc as CurrencyBtcIcon} from '@phosphor-icons/react/dist/ssr/CurrencyBtc';
import {CurrencyDollar as CurrencyDollarIcon} from '@phosphor-icons/react/dist/ssr/CurrencyDollar';
import {CurrencyEth as CurrencyEthIcon} from '@phosphor-icons/react/dist/ssr/CurrencyEth';
import {Line, LineChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';

import type {ColumnDef} from '@/components/core/data-table';
import {DataTable} from '@/components/core/data-table';
import {NoSsr} from '@/components/core/no-ssr';

export type Coin = 'BTC' | 'ETH' | 'USDT' | 'SOL';

const coinMapping = {
    BTC: {color: 'warning', icon: CurrencyBtcIcon},
    ETH: {color: 'primary', icon: CurrencyEthIcon},
    USDT: {color: 'success', icon: CurrencyDollarIcon},
    SOL: {color: 'neutral', icon: CurrencyBtcIcon},
} as const;

export interface RowModel {
    id: string;
    name: string;
    price: number;
    diff1d: number;
    trend1d: 'up' | 'down';
    diff7d: number;
    trend7d: 'up' | 'down';
    marketCap: number | string;
    volume1d: number | string;
    summary: number[];
}

const columns = [
    {
        formatter: (row): React.JSX.Element => {
            const {color, icon: Icon} = coinMapping[row.id as Coin] ?? {color: 'neutral', icon: CurrencyBtcIcon};

            return (
                <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                    <Avatar
                        color={color}
                        sx={{
                            '--Avatar-size': '24px',
                            '--Avatar-radius': 'var(--joy-radius-sm)',
                            '--Icon-fontSize': 'var(--joy-fontSize-lg)',
                        }}
                    >
                        <Icon fontSize="var(--Icon-fontSize)" weight="bold"/>
                    </Avatar>
                    <Typography>{row.name}</Typography>
                </Stack>
            );
        },
        name: 'Name',
        width: '120px',
    },
    {
        formatter: (row): string => {
            return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(row.price);
        },
        name: 'Price',
        width: '130px',
    },
    {
        formatter: (row): React.JSX.Element => {
            const trendColor = row.trend1d === 'up' ? 'success' : 'danger';
            const trendSymbol = row.trend1d === 'up' ? '+' : '-';

            return (
                <Typography color={trendColor} whiteSpace="nowrap">
                    {trendSymbol}{' '}
                    {new Intl.NumberFormat('en-US', {
                        style: 'percent',
                        maximumFractionDigits: 2
                    }).format(row.diff1d / 100)}
                </Typography>
            );
        },
        name: '24h',
        width: '75px',
    },
    {
        formatter: (row): React.JSX.Element => {
            const trendColor = row.trend7d === 'up' ? 'success' : 'danger';
            const trendSymbol = row.trend7d === 'up' ? '+' : '-';

            return (
                <Typography color={trendColor} whiteSpace="nowrap">
                    {trendSymbol}{' '}
                    {new Intl.NumberFormat('en-US', {
                        style: 'percent',
                        maximumFractionDigits: 2
                    }).format(row.diff7d / 100)}
                </Typography>
            );
        },
        name: '7d',
        width: '75px',
    },
    {field: 'marketCap', name: 'Market Cap', width: '120px'},
    {field: 'volume1d', name: 'Volume 24h', width: '120px'},
    {
        formatter: (row): React.JSX.Element => {
            return <Summary data={row.summary}/>;
        },
        name: 'Last 7 days',
        width: '120px',
    },
] satisfies ColumnDef<RowModel>[];

export interface MarketValuesProps {
    data: RowModel[];
}

export function MarketValues({data}: MarketValuesProps): React.JSX.Element {
    return (
        <Card>
            <Typography level="h4">Market Values</Typography>
            <Box sx={{overflowX: 'auto'}}>
                <DataTable<RowModel>
                    columns={columns}
                    rows={data}
                    stripe="even"
                    sx={{'--TableCell-paddingX': '12px', '--TableCell-paddingY': '8px'}}
                />
            </Box>
        </Card>
    );
}

interface SummaryProps {
    data: number[];
}

function Summary({data: dataRaw = []}: SummaryProps): React.JSX.Element {
    const chartHeight = 60;
    const data = dataRaw.map((entry, index): { name: string; value: number } => ({
        name: `Entry-${index}`,
        value: entry,
    }));

    const dataRawSorted = [...dataRaw].sort((a, b) => a - b);
    const minValue = dataRawSorted[0];
    const maxValue = dataRawSorted[dataRawSorted.length - 1];

    return (
        <NoSsr fallback={<Box sx={{height: `${chartHeight}px`}}/>}>
            <ResponsiveContainer height={chartHeight}>
                <LineChart data={data} margin={{top: 10, right: 0, bottom: -20, left: -60}}>
                    <XAxis axisLine={false} dataKey="name" tick={false}/>
                    <YAxis axisLine={false} dataKey="value" domain={[minValue ?? 0, maxValue ?? 0]} tick={false}/>
                    <Line
                        animationDuration={200}
                        dataKey="value"
                        dot={false}
                        stroke="var(--joy-palette-success-400)"
                        strokeWidth="2"
                        type="basis"
                    />
                </LineChart>
            </ResponsiveContainer>
        </NoSsr>
    );
}
