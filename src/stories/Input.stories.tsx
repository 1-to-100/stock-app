import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';

import { fn } from 'storybook/test';

import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['outlined'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'neutral', 'danger', 'success', 'warning'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
  args: { 
    onChange: fn(),
    onFocus: fn(),
    onBlur: fn(),
    placeholder: 'Enter text...',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your text here',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Hello World',
    placeholder: 'Enter your text here',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Disabled input',
    placeholder: 'This input is disabled',
  },
};

export const Error: Story = {
  args: {
    error: true,
    value: 'Invalid input',
    placeholder: 'Enter valid text',
  },
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'This field is required',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
};

export const WithStartDecorator: Story = {
  args: {
    startDecorator: '🔍',
    placeholder: 'Search with icon',
  },
};

export const WithEndDecorator: Story = {
  args: {
    endDecorator: '✓',
    placeholder: 'Input with end decorator',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start', minWidth: '300px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4>Types</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Input type="text" placeholder="Text input" />
          <Input type="email" placeholder="Email input" />
          <Input type="password" placeholder="Password input" />
          <Input type="number" placeholder="Number input" />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4>Sizes</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Input size="sm" placeholder="Small" />
          <Input size="md" placeholder="Medium" />
          <Input size="lg" placeholder="Large" />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4>States</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Input placeholder="Normal" />
          <Input disabled placeholder="Disabled" />
          <Input error placeholder="Error state" />
          <Input required placeholder="Required" />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4>Decorators</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Input startDecorator="🔍" placeholder="With start decorator" />
          <Input endDecorator="✓" placeholder="With end decorator" />
          <Input startDecorator="📧" endDecorator="→" placeholder="With both decorators" />
        </div>
      </div>
    </div>
  ),
};
