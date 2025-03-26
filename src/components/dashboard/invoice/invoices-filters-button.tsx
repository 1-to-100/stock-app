'use client';

import * as React from 'react';
import Button from '@mui/joy/Button';
import { Funnel as FunnelIcon } from '@phosphor-icons/react/dist/ssr/Funnel';

import { InvoicesFiltersDrawer } from './invoices-filters-drawer';

export function InvoicesFiltersButton(): React.JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Button
        color="neutral"
        onClick={(): void => {
          setOpen(!open);
        }}
        startDecorator={<FunnelIcon fontSize="var(--Icon-fontSize)" weight="bold" />}
        sx={{ display: { lg: 'none' } }}
        variant="outlined"
      >
        Filters
      </Button>
      <InvoicesFiltersDrawer
        onClose={(): void => {
          setOpen(false);
        }}
        open={open}
      />
    </React.Fragment>
  );
}
