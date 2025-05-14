'use client';

import * as React from 'react';
import { Select, Option, FormControl, Typography } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/lib/api/customers";

export function CustomerSelect(): React.JSX.Element {
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<number | null>(null);

  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  React.useEffect(() => {
    const storedCustomerId = localStorage.getItem('selectedCustomerId');
    if (storedCustomerId) {
      const numericId = parseInt(storedCustomerId, 10);
      setSelectedCustomerId(numericId);
    }
  }, []);

  return (
    <FormControl>
      {selectedCustomerId && (
        <Typography
          level="body-xs"
          sx={{
            position: 'absolute',
            top: '-8px',
            left: '8px',
            px: '4px',
            zIndex: 1,
            color: 'var(--joy-palette-text-secondary)',
            fontSize: '10px',
            fontWeight: '300',
          }}
        >
          Select customer
        </Typography>
      )}
      <Select
        placeholder="Select customer"
        value={selectedCustomerId}
        sx={{
          borderRadius: "6px",
          fontSize: { xs: "12px", sm: "14px" },
          minWidth: "200px",
        }}
        onChange={(_, value) => {
          if (value) {
            const numericValue = parseInt(value.toString(), 10);
            setSelectedCustomerId(numericValue);
            localStorage.setItem('selectedCustomerId', numericValue.toString());
            window.location.reload();
          }
        }}
      >
        {customers?.map((customer) => (
          <Option key={customer.id} value={customer.id}>
            {customer.name.slice(0, 20)}
          </Option>
        ))}
      </Select>
    </FormControl>
  );
} 