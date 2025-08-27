'use client';

import { useEffect, useState } from 'react';

export default function StorybookPage() {
  const [storybookUrl, setStorybookUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkStorybookAvailability = async () => {
      try {
        const isDev = process.env.NODE_ENV === 'development';
        
        if (isDev) {
          // В режимі розробки перевіряємо, чи запущений Storybook
          try {
            await fetch('http://localhost:6006', { 
              method: 'HEAD',
              mode: 'no-cors'
            });
            setStorybookUrl('http://localhost:6006');
          } catch (err) {
            throw new Error('Storybook dev server not available');
          }
        } else {
          // В продакшні використовуємо API route
          setStorybookUrl('/api/storybook?path=index.html');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Storybook check failed:', err);
        setError('Storybook is not available');
        setIsLoading(false);
      }
    };

    checkStorybookAvailability();
  }, []);

  if (isLoading) {
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
          Please wait while we check Storybook availability
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e74c3c' }}>
          Storybook Not Available
        </div>
        <div style={{ fontSize: '14px', color: '#666', maxWidth: '400px' }}>
          {process.env.NODE_ENV === 'development' 
            ? 'Storybook is not running. Please start it with "npm run storybook" in a separate terminal.'
            : 'Storybook static files are not built. Please run "npm run build-storybook" first.'
          }
        </div>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '20px' }}>
          <div>Development: http://localhost:6006</div>
          <div>Production: /api/storybook</div>
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
      onError={() => setError('Failed to load Storybook')}
    />
  );
}
