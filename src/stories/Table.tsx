import React from 'react';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Pagination from '../components/dashboard/layout/pagination';

export interface TableData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
}

export interface TableProps {
  data: TableData[];
  itemsPerPage?: number;
  showPagination?: boolean;
  title?: string;
}

export function TableComponent({ 
  data, 
  itemsPerPage = 10, 
  showPagination = true,
  title = 'Users Table'
}: TableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [disabled, setDisabled] = React.useState(false);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      {title && (
        <Typography level="h4" sx={{ mb: 2, color: 'var(--joy-palette-text-primary)' }}>
          {title}
        </Typography>
      )}
      
      <Sheet
        sx={{
          width: '100%',
          borderRadius: 'sm',
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-label="basic table"
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '12px',
            '--TableCell-paddingX': '16px',
            '--TableCell-color': 'var(--joy-palette-text-primary)',
            '& .MuiTypography-root': {
              color: 'var(--joy-palette-text-primary) !important',
              fontWeight: '300 !important',
            },
          }}
        >
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'center' }}>
                  {startIndex + index + 1}
                </td>
                <td>
                  <Typography level="body-sm" fontWeight="lg">
                    {row.name}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-sm">
                    {row.email}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-sm">
                    {row.role}
                  </Typography>
                </td>
                <td>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 'sm',
                      fontSize: 'xs',
                      fontWeight: 'sm',
                      backgroundColor: `var(--joy-palette-${getStatusColor(row.status)}-softBg)`,
                      color: `var(--joy-palette-${getStatusColor(row.status)}-softColor)`,
                    }}
                  >
                    {row.status}
                  </Box>
                </td>
                <td>
                  <Typography level="body-sm">
                    {row.lastLogin}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      {showPagination && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          disabled={disabled}
        />
      )}
    </Box>
  );
}
