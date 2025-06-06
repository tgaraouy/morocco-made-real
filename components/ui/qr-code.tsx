'use client';

import React, { useEffect, useRef, useState } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function QRCode({ value, size = 200, className = '', style = {} }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [useLibrary, setUseLibrary] = useState(true);

  useEffect(() => {
    generateQRCode(value, size);
  }, [value, size]);

  const generateQRCode = async (text: string, size: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;

    setIsLoading(true);
    setError('');

    if (useLibrary) {
      try {
        // Try to import QR code library
        const QRCodeLib = await import('qrcode');
        
        await QRCodeLib.toCanvas(canvas, text, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });

        setIsLoading(false);
        return;

      } catch (err) {
        console.error('QR code library failed, using fallback:', err);
        setUseLibrary(false);
        setError('Using demo mode');
      }
    }

    // Fallback to demo pattern
    generateDemoQRCode(text, size);
    setIsLoading(false);
  };

  const generateDemoQRCode = (text: string, size: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Demo QR pattern with WhatsApp styling
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Green border (WhatsApp style)
    ctx.fillStyle = '#25D366';
    ctx.fillRect(0, 0, size, 8);
    ctx.fillRect(0, 0, 8, size);
    ctx.fillRect(size - 8, 0, 8, size);
    ctx.fillRect(0, size - 8, size, 8);

    // Corner squares (QR code style)
    const cornerSize = size / 7;
    
    // Top-left corner
    ctx.fillStyle = '#000000';
    ctx.fillRect(15, 15, cornerSize, cornerSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(25, 25, cornerSize - 20, cornerSize - 20);
    ctx.fillStyle = '#000000';
    ctx.fillRect(35, 35, cornerSize - 40, cornerSize - 40);
    
    // Top-right corner
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - cornerSize - 15, 15, cornerSize, cornerSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(size - cornerSize - 5, 25, cornerSize - 20, cornerSize - 20);
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - cornerSize + 5, 35, cornerSize - 40, cornerSize - 40);
    
    // Bottom-left corner
    ctx.fillStyle = '#000000';
    ctx.fillRect(15, size - cornerSize - 15, cornerSize, cornerSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(25, size - cornerSize - 5, cornerSize - 20, cornerSize - 20);
    ctx.fillStyle = '#000000';
    ctx.fillRect(35, size - cornerSize + 5, cornerSize - 40, cornerSize - 40);

    // Add realistic QR pattern in the middle
    ctx.fillStyle = '#000000';
    const cellSize = 3;
    for (let x = cornerSize + 30; x < size - cornerSize - 30; x += cellSize) {
      for (let y = cornerSize + 30; y < size - cornerSize - 30; y += cellSize) {
        // Create a pattern based on text hash
        const hash = hashCode(text + x.toString() + y.toString());
        if (hash % 3 === 0) {
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }

    // Center WhatsApp logo area
    const centerX = size / 2 - 20;
    const centerY = size / 2 - 20;
    ctx.fillStyle = '#25D366';
    ctx.fillRect(centerX, centerY, 40, 40);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('WA', size / 2, size / 2 + 5);
    
    // Add timing patterns
    ctx.fillStyle = '#000000';
    for (let i = cornerSize + 20; i < size - cornerSize - 20; i += cellSize * 2) {
      ctx.fillRect(i, cornerSize + 10, cellSize, cellSize);
      ctx.fillRect(cornerSize + 10, i, cellSize, cellSize);
    }
  };

  // Simple hash function for pattern generation
  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  return (
    <div className={`inline-block ${className}`} style={style}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="border border-gray-200 rounded-lg shadow-sm"
          style={{ 
            maxWidth: '100%',
            height: 'auto'
          }}
        />
        
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 text-center mt-2">
        📱 Scan with WhatsApp camera
      </div>
      
      {error && (
        <div className="text-xs text-orange-500 text-center mt-1">
          Demo QR code - {value.slice(0, 20)}...
        </div>
      )}
    </div>
  );
}

// Simplified hook for generating QR codes
export function useQRCode(text: string, options?: { size?: number; margin?: number }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!text) {
      setQrDataUrl('');
      return;
    }

    const generateQR = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const QRCodeLib = await import('qrcode');
        
        const dataUrl = await QRCodeLib.toDataURL(text, {
          width: options?.size || 256,
          margin: options?.margin || 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('QR generation error:', err);
        setError('Failed to generate QR code');
        // Create a fallback data URL
        setQrDataUrl('data:image/svg+xml;base64,' + btoa(`
          <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" fill="white"/>
            <rect x="0" y="0" width="256" height="20" fill="#25D366"/>
            <rect x="118" y="118" width="20" height="20" fill="#25D366"/>
            <text x="128" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white">WA</text>
          </svg>
        `));
      } finally {
        setIsLoading(false);
      }
    };

    generateQR();
  }, [text, options?.size, options?.margin]);

  return { qrDataUrl, isLoading, error };
} 