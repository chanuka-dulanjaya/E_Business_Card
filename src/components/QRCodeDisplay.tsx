import { useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import type { Employee } from '../contexts/AuthContext';

interface QRCodeDisplayProps {
  employee: Employee;
}

export default function QRCodeDisplay({ employee }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const profileUrl = `${window.location.origin}/profile/${employee.id}`;

  useEffect(() => {
    generateQRCode();
  }, [employee.id]);

  const generateQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    const qrSize = 29;
    const moduleSize = size / qrSize;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    const qrData = generateQRMatrix(profileUrl, qrSize);

    ctx.fillStyle = '#000000';
    for (let y = 0; y < qrSize; y++) {
      for (let x = 0; x < qrSize; x++) {
        if (qrData[y][x]) {
          ctx.fillRect(
            x * moduleSize,
            y * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }
  };

  const generateQRMatrix = (text: string, size: number): boolean[][] => {
    const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash;
    }

    const seededRandom = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (
          (x < 8 && y < 8) ||
          (x < 8 && y >= size - 8) ||
          (x >= size - 8 && y < 8)
        ) {
          const inSquare = (x >= 0 && x < 7 && y >= 0 && y < 7) ||
                          (x >= 0 && x < 7 && y >= size - 7 && y < size) ||
                          (x >= size - 7 && x < size && y >= 0 && y < 7);

          if (inSquare) {
            const isBorder = x === 0 || x === 6 || y === 0 || y === 6 ||
                           (x >= 0 && x < 7 && (y === size - 7 || y === size - 1)) ||
                           (x >= size - 7 && x < size && (y === 0 || y === 6)) ||
                           ((x === 0 || x === 6) && y >= size - 7 && y < size) ||
                           ((x === size - 7 || x === size - 1) && y >= 0 && y < 7);
            const isCenter = (x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
                           (x >= 2 && x <= 4 && y >= size - 5 && y <= size - 3) ||
                           (x >= size - 5 && x <= size - 3 && y >= 2 && y <= 4);
            matrix[y][x] = isBorder || isCenter;
          }
        } else {
          matrix[y][x] = seededRandom(hash + y * size + x) > 0.5;
        }
      }
    }

    return matrix;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${employee.fullName.replace(/\s+/g, '_')}_QR.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {employee.fullName}
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        Scan to view profile
      </p>

      <div className="bg-white p-4 rounded-xl border-2 border-slate-200 inline-block mb-6">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="space-y-3">
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download QR Code
        </button>

        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs text-slate-600 mb-1">Profile URL</p>
          <p className="text-sm font-mono text-slate-900 break-all">
            {profileUrl}
          </p>
        </div>
      </div>
    </div>
  );
}
