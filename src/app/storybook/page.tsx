'use client';

import { useEffect, useState } from 'react';

export default function StorybookPage() {
  const [storybookUrl, setStorybookUrl] = useState<string>('');

  useEffect(() => {
    // Визначаємо URL для Storybook
    const isDev = process.env.NODE_ENV === 'development';
    const baseUrl = isDev ? 'http://localhost:6006' : '/storybook-static';
    setStorybookUrl(baseUrl);
  }, []);

  if (!storybookUrl) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>Loading Storybook...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {process.env.NODE_ENV === 'development' 
            ? 'Make sure Storybook is running on port 6006' 
            : 'Storybook static files not found. Run "npm run build-storybook" first.'
          }
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={storybookUrl}
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        margin: 0,
        padding: 0,
      }}
      title="Storybook"
    />
  );
}
