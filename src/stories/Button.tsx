import React from 'react';
import { Button as JoyButton, ButtonProps as JoyButtonProps } from '@mui/joy';

export interface ButtonProps extends Omit<JoyButtonProps, 'variant' | 'color' | 'size'> {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Button variant */
  variant?: 'solid' | 'outlined' | 'plain';
  /** Button color */
  color?: 'primary' | 'neutral' | 'danger';
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  variant = 'solid',
  color = 'primary',
  ...props
}: ButtonProps) => {
  // Map primary prop to variant and color
  const buttonVariant = primary ? 'solid' : variant;
  const buttonColor = primary ? 'primary' : color;

  // Map size to Joy UI size
  const joySize = size === 'large' ? 'lg' : size === 'small' ? 'sm' : 'md';

  return (
    <JoyButton
      variant={buttonVariant}
      color={buttonColor}
      size={joySize}
      sx={{
        // Базові стилі для різних варіантів
        ...(buttonVariant === 'solid' && {
          background: buttonColor === 'primary' 
            ? 'linear-gradient(120deg, #282490 0%, #3F4DCF 100%)'
            : buttonColor === 'neutral'
            ? 'var(--joy-palette-neutral-500)'
            : 'var(--joy-palette-danger-500)',
          color: 'white',
          '&:hover': {
            background: buttonColor === 'primary'
              ? 'linear-gradient(120deg, #1E1A6F 0%, #3439B0 100%)'
              : buttonColor === 'neutral'
              ? 'var(--joy-palette-neutral-600)'
              : 'var(--joy-palette-danger-600)',
          },
        }),
        ...(buttonVariant === 'outlined' && {
          border: `2px solid ${buttonColor === 'primary' 
            ? 'var(--joy-palette-primary-500)' 
            : buttonColor === 'neutral'
            ? 'var(--joy-palette-neutral-500)'
            : 'var(--joy-palette-danger-500)'}`,
          color: buttonColor === 'primary' 
            ? 'var(--joy-palette-primary-500)' 
            : buttonColor === 'neutral'
            ? 'var(--joy-palette-neutral-500)'
            : 'var(--joy-palette-danger-500)',
          backgroundColor: 'transparent',
        }),
        ...(buttonVariant === 'plain' && {
          color: buttonColor === 'primary' 
            ? 'var(--joy-palette-primary-500)' 
            : buttonColor === 'neutral'
            ? 'var(--joy-palette-neutral-500)'
            : 'var(--joy-palette-danger-500)',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: buttonColor === 'primary' 
              ? 'var(--joy-palette-primary-50)' 
              : buttonColor === 'neutral'
              ? 'var(--joy-palette-neutral-50)'
              : 'var(--joy-palette-danger-50)',
          },
        }),
        ...(backgroundColor && { backgroundColor }),
      }}
      {...props}
    >
      {label}
    </JoyButton>
  );
};
