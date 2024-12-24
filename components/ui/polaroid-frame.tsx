import { format } from 'date-fns';
import { useRef } from 'react';
import html2canvas from 'html2canvas';

interface PolaroidFrameProps {
  imageUrl: string | undefined;
  originalUrl: string | undefined;
  userId: string | undefined;
}

export function PolaroidFrame({ imageUrl, originalUrl, userId }: PolaroidFrameProps) {
  const polaroidRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'yyyy.MM.dd HH:mm');

  const handleDownload = async () => {
    if (!polaroidRef.current || !imageUrl) return;

    try {
      const canvas = await html2canvas(polaroidRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `twitter-christmas-${userId}-${new Date().getTime()}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  if (!imageUrl || !originalUrl) return null;

  return (
    <div className="flex gap-12 items-start justify-between max-w-5xl mx-auto">
      {/* Original Image */}
      <div className="w-[400px]">
        <div className="bg-white rounded-lg shadow-xl p-4 transform transition-transform duration-300 hover:scale-[1.02]">
          <div className="relative w-full" style={{ aspectRatio: '1' }}>
            <img
              src={originalUrl}
              alt="Original Twitter Avatar"
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm font-medium">Original Avatar</p>
            <p className="text-gray-400 text-xs mt-1">@{userId}</p>
            <p className="text-gray-400 text-xs mt-1">{formattedDate}</p>
          </div>
        </div>
      </div>

      {/* Generated Image */}
      <div className="w-[400px]">
        <div 
          ref={polaroidRef}
          className="bg-white rounded-lg shadow-xl p-4 transform transition-transform duration-300 hover:scale-[1.02] relative group"
        >
          <div className="relative w-full" style={{ aspectRatio: '1' }}>
            <img
              src={imageUrl}
              alt="Generated Christmas Portrait"
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm font-medium">Christmas Portrait</p>
            <p className="text-gray-400 text-xs mt-1">@{userId}</p>
            <p className="text-gray-400 text-xs mt-1">{formattedDate}</p>
          </div>

          <button
            onClick={handleDownload}
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
