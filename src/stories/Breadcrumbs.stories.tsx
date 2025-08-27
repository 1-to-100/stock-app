import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';

import { fn } from 'storybook/test';

import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'neutral', 'danger', 'success', 'warning'],
    },
    separator: {
      control: { type: 'text' },
    },
    lastItemClickable: {
      control: 'boolean',
    },
  },
  args: { 
    items: [
      { label: 'Home', href: '/', icon: '🏠' },
      { label: 'Documents', href: '/documents', icon: '📁' },
      { label: 'Report.pdf', icon: '📄' },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', href: '/products/electronics' },
      { label: 'Smartphones', href: '/products/electronics/smartphones' },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: 'Home', href: '/', icon: '🏠' },
      { label: 'Documents', href: '/documents', icon: '📁' },
      { label: 'Reports', href: '/documents/reports', icon: '📁' },
      { label: 'Q4-2023.pdf', icon: '📄' },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    separator: '>',
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Analytics', href: '/dashboard/analytics' },
      { label: 'Sales', href: '/dashboard/analytics/sales' },
    ],
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    items: [
      { label: 'Home', href: '/' },
      { label: 'Settings', href: '/settings' },
      { label: 'Profile', href: '/settings/profile' },
    ],
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    items: [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Project Alpha', href: '/projects/alpha' },
    ],
  },
};

export const DifferentColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <Breadcrumbs
        color="primary"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Primary', href: '/primary' },
        ]}
      />
      <Breadcrumbs
        color="success"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Success', href: '/success' },
        ]}
      />
      <Breadcrumbs
        color="warning"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Warning', href: '/warning' },
        ]}
      />
      <Breadcrumbs
        color="danger"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Danger', href: '/danger' },
        ]}
      />
    </div>
  ),
};

export const LastItemClickable: Story = {
  args: {
    lastItemClickable: true,
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Current Product', href: '/products/current' },
    ],
  },
};

export const AllVariants: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Page', href: '/page' },
    ],
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start', minWidth: '400px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4>Sizes</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Breadcrumbs
            size="sm"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Small', href: '/small' },
            ]}
          />
          <Breadcrumbs
            size="md"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Medium', href: '/medium' },
            ]}
          />
          <Breadcrumbs
            size="lg"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Large', href: '/large' },
            ]}
          />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4>Separators</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Breadcrumbs
            separator="/"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Slash', href: '/slash' },
            ]}
          />
          <Breadcrumbs
            separator=">"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Arrow', href: '/arrow' },
            ]}
          />
          <Breadcrumbs
            separator="•"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Dot', href: '/dot' },
            ]}
          />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4>With Icons</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/', icon: '🏠' },
              { label: 'Documents', href: '/documents', icon: '📁' },
              { label: 'Report.pdf', icon: '📄' },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};
