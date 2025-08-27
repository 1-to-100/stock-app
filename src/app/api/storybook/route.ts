import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || 'index.html';
  
  // Безпечний шлях до файлів Storybook
  const storybookPath = join(process.cwd(), 'public', 'storybook-static', path);
  
  // Перевіряємо, чи файл існує та знаходиться в дозволеній папці
  if (!existsSync(storybookPath) || !storybookPath.includes('storybook-static')) {
    return new NextResponse('File not found', { status: 404 });
  }
  
  try {
    const fileContent = readFileSync(storybookPath);
    
    // Визначаємо MIME тип на основі розширення файлу
    const ext = path.split('.').pop()?.toLowerCase();
    let contentType = 'text/plain';
    
    switch (ext) {
      case 'html':
        contentType = 'text/html';
        break;
      case 'css':
        contentType = 'text/css';
        break;
      case 'js':
        contentType = 'application/javascript';
        break;
      case 'json':
        contentType = 'application/json';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'woff2':
        contentType = 'font/woff2';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      default:
        contentType = 'application/octet-stream';
    }
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving Storybook file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
