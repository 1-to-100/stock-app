import type { Components, Theme } from '@mui/joy/styles';

export const JoyButton = {
  styleOverrides: {
    root: ({ ownerState }) => ({
      borderRadius: '20px',
      padding: '8px 16px',
      fontSize: '16px',
      fontWeight: 600,
      color: '#FFFFFF',
      transition: 'all 0.2s ease-in-out',

      ...(ownerState.variant === 'solid' && ownerState.color === 'primary' && {
        '--variant-solidBg': 'linear-gradient(120deg, #282490 0%, #3F4DCF 100%)',
        '--variant-solidHoverBg': 'linear-gradient(120deg, #1E1A6F 0%, #3439B0 100%)', 
        boxShadow: '0 3px 6px rgba(0,102,204,0.2)',
      
        background: 'var(--variant-solidBg)',

        '&:hover': {
          background: 'var(--variant-solidHoverBg)',
        },

        '&:active': {
          transform: 'scale(0.98)',
        },
      }),

      ...(ownerState.color === 'neutral' && {
        backgroundColor: '#646872',
        border: '1px solid #E5E7EB',
        padding: '2px 10px',
  
        '&:hover': {
          backgroundColor: '#646872',
        },
      }),
  
      ...(ownerState.color === 'danger' && {
        backgroundColor: '#D3232F',
        padding: '2px 10px',
        '&:hover': {
          backgroundColor: '#DC2626',
        },
      }),
    }),
  },
} satisfies Components<Theme>['JoyButton'];
