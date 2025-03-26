'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Avatar from '@mui/joy/Avatar';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { Pen as PenIcon } from '@phosphor-icons/react/dist/ssr/Pen';

import { paths } from '@/paths';
import { useSelection } from '@/hooks/use-selection';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';

export interface Customer {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  orders: number;
  currency: string;
  paid: number;
}

const columns = [
  {
    formatter: (row): React.JSX.Element => (
      <Link
        component={RouterLink}
        fontSize="sm"
        fontWeight="md"
        href={paths.dashboard.customers.details('1')}
        underline="none"
      >
        {row.id}
      </Link>
    ),
    name: 'Customer ID',
    width: '150px',
  },
  {
    formatter: (row): React.JSX.Element => (
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Avatar src={row.avatar ?? undefined} />
        <div>
          <Typography level="body-sm" textColor="text.primary">
            {row.name}
          </Typography>
          <Typography level="body-xs">{row.email}</Typography>
        </div>
      </Stack>
    ),
    name: 'Name',
    width: '300px',
  },
  {
    formatter: (row): string => {
      return `${row.state}, ${row.city}, ${row.zipCode}`;
    },
    name: 'Address',
    width: '250px',
  },
  { field: 'phone', name: 'Phone Number', width: '200px' },
  {
    formatter: (row): string => {
      return new Intl.NumberFormat('en-US').format(row.orders);
    },
    name: 'Orders',
    width: '100px',
  },
  {
    formatter: (row): string => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: row.currency }).format(row.paid);
    },
    name: 'Paid',
    width: '100px',
  },
  {
    formatter: (): React.JSX.Element => (
      <IconButton color="neutral" size="sm" variant="plain">
        <PenIcon fontSize="var(--Icon-fontSize)" weight="bold" />
      </IconButton>
    ),
    name: 'Actions',
    hideName: true,
    width: '80px',
    align: 'right',
  },
] satisfies ColumnDef<Customer>[];

export interface CustomersTableProps {
  rows: Customer[];
}

export function CustomersTable({ rows }: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => rows.map((row) => row.id), [rows]);
  const selection = useSelection(rowIds);

  return (
    <DataTable<Customer>
      columns={columns}
      onDeselectAll={selection.deselectAll}
      onDeselectOne={(_, row) => {
        selection.deselectOne(row.id);
      }}
      onSelectAll={selection.selectAll}
      onSelectOne={(_, row) => {
        selection.selectOne(row.id);
      }}
      rows={rows}
      selectable
      selected={selection.selected}
      stripe="even"
    />
  );
}
