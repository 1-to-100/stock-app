'use client';

import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import dayjs from 'dayjs';

import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';

const statusMapping = {
  draft: { label: 'Draft', color: 'neutral' },
  ongoing: { label: 'Ongoing', color: 'primary' },
  shipped: { label: 'Shipped', color: 'warning' },
  delivered: { label: 'Delivered', color: 'success' },
  canceled: { label: 'Canceled', color: 'danger' },
} as const;

export interface Shipment {
  id: string;
  driver: { name: string; avatar?: string };
  orderId: string;
  pickLocation: string;
  dropLocation: string;
  weight: number;
  currency: string;
  amount: number;
  status: 'draft' | 'ongoing' | 'shipped' | 'delivered' | 'canceled';
  startedAt: Date;
}

const columns = [
  {
    formatter: (row): React.JSX.Element => (
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Avatar src={row.driver.avatar} />
        <Typography>{row.driver.name}</Typography>
      </Stack>
    ),
    name: 'Driver',
    width: '200px',
  },
  {
    formatter: (row): string => {
      return dayjs(row.startedAt).format('MMM D, YYYY h:mm A');
    },
    name: 'Date',
    width: '200px',
    align: 'center',
  },
  { field: 'orderId', name: 'Order', width: '120px', align: 'center' },
  { field: 'pickLocation', name: 'Pick Location', width: '150px', align: 'center' },
  { field: 'dropLocation', name: 'Drop Location', width: '150px', align: 'center' },
  {
    formatter: (row): string => {
      return new Intl.NumberFormat('en-US', { style: 'unit', unit: 'kilogram' }).format(row.weight);
    },
    name: 'Weight',
    width: '100px',
    align: 'center',
  },
  {
    formatter: (row): string => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: row.currency }).format(row.amount);
    },
    name: 'Amount',
    width: '100px',
    align: 'center',
  },
  {
    formatter: (row): React.JSX.Element => {
      const { label, color } = statusMapping[row.status];

      return (
        <Chip color={color} size="sm" variant="soft">
          {label}
        </Chip>
      );
    },
    name: 'Status',
    width: '150px',
    align: 'right',
  },
] satisfies ColumnDef<Shipment>[];

export interface ShippingHistoryProps {
  shipments: Shipment[];
}

export function ShippingHistory({ shipments = [] }: ShippingHistoryProps): React.JSX.Element {
  return (
    <Card sx={{ gap: 3 }}>
      <Typography level="h4">Shipping History</Typography>
      <CardOverflow sx={{ m: 'var(--CardOverflow-offset)', overflowX: 'auto' }}>
        <DataTable<Shipment>
          columns={columns}
          rows={shipments}
          stripe="even"
          sx={{ '--TableCell-paddingX': '16px', '--TableCell-paddingY': '12px' }}
        />
      </CardOverflow>
    </Card>
  );
}
