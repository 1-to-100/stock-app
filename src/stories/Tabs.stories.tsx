import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';

import { fn } from 'storybook/test';

import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['custom'],
    },
    showContent: {
      control: 'boolean',
    },
  },
  args: { 
    onChange: fn(),
    showContent: true,
    variant: 'custom',
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      { value: 'tab1', label: 'Tab 1', content: 'Content for Tab 1' },
      { value: 'tab2', label: 'Tab 2', content: 'Content for Tab 2' },
      { value: 'tab3', label: 'Tab 3', content: 'Content for Tab 3' },
    ],
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    tabs: [
      { value: 'tab1', label: 'Small Tab 1', content: 'Small tab content 1' },
      { value: 'tab2', label: 'Small Tab 2', content: 'Small tab content 2' },
    ],
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    tabs: [
      { value: 'tab1', label: 'Large Tab 1', content: 'Large tab content 1' },
      { value: 'tab2', label: 'Large Tab 2', content: 'Large tab content 2' },
    ],
  },
};

export const WithoutContent: Story = {
  args: {
    showContent: false,
    tabs: [
      { value: 'tab1', label: 'Tab 1' },
      { value: 'tab2', label: 'Tab 2' },
      { value: 'tab3', label: 'Tab 3' },
    ],
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'tab2',
    tabs: [
      { value: 'tab1', label: 'Tab 1', content: 'Content for Tab 1' },
      { value: 'tab2', label: 'Tab 2', content: 'Content for Tab 2 (default)' },
      { value: 'tab3', label: 'Tab 3', content: 'Content for Tab 3' },
    ],
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      { value: 'tab1', label: 'First Tab', content: 'First tab content' },
      { value: 'tab2', label: 'Second Tab', content: 'Second tab content' },
      { value: 'tab3', label: 'Third Tab', content: 'Third tab content' },
      { value: 'tab4', label: 'Fourth Tab', content: 'Fourth tab content' },
      { value: 'tab5', label: 'Fifth Tab', content: 'Fifth tab content' },
    ],
  },
};

export const AuthTabs: Story = {
  args: {
    tabs: [
      { value: 'sign-in', label: 'Sign In', content: 'Sign in form content' },
      { value: 'sign-up', label: 'Sign Up', content: 'Sign up form content' },
    ],
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'flex-start', minWidth: '400px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4>Basic Tabs</h4>
        <Tabs
          tabs={[
            { value: 'tab1', label: 'Tab 1', content: 'Basic tab content 1' },
            { value: 'tab2', label: 'Tab 2', content: 'Basic tab content 2' },
            { value: 'tab3', label: 'Tab 3', content: 'Basic tab content 3' },
          ]}
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4>Sizes</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <strong>Small:</strong>
            <Tabs
              size="sm"
              tabs={[
                { value: 'small1', label: 'Small 1', content: 'Small tab 1' },
                { value: 'small2', label: 'Small 2', content: 'Small tab 2' },
              ]}
            />
          </div>
          <div>
            <strong>Large:</strong>
            <Tabs
              size="lg"
              tabs={[
                { value: 'large1', label: 'Large 1', content: 'Large tab 1' },
                { value: 'large2', label: 'Large 2', content: 'Large tab 2' },
              ]}
            />
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4>Without Content</h4>
        <Tabs
          showContent={false}
          tabs={[
            { value: 'tab1', label: 'Tab 1' },
            { value: 'tab2', label: 'Tab 2' },
            { value: 'tab3', label: 'Tab 3' },
          ]}
        />
      </div>
    </div>
  ),
};
