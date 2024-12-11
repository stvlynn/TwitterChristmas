import { format } from 'date-fns';
import { useRef } from 'react';
import html2canvas from 'html2canvas';

interface PolaroidFrameProps {
  imageUrl: string;
  userId: string;
}

export function PolaroidFrame({ imageUrl, userId }: PolaroidFrameProps) {
  const polaroidRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'yyyy.MM.dd HH:mm');

  const handleDownload = async () => {
    if (!polaroidRef.current) return;

    try {
      const canvas = await html2canvas(polaroidRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
        useCORS: true, // Enable CORS for images
      });

      // Convert to blob
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `twitter-portrait-${userId}-${new Date().getTime()}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 'image/jpeg', 0.95); // High quality JPEG
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <div className="group relative">
      <div 
        ref={polaroidRef}
        className="bg-white rounded-lg shadow-xl p-4 transform transition-transform duration-300 hover:scale-[1.02]" 
        style={{ aspectRatio: '0.85' }}
      >
        {/* Image container - positioned at the top with Polaroid-like margin */}
        <div className="relative w-full mb-4" style={{ height: '80%' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Generated portrait"
            className="w-full h-full object-cover rounded"
            crossOrigin="anonymous" // Enable CORS for the image
          />
        </div>
        
        {/* Polaroid bottom text area */}
        <div className="flex flex-col items-center space-y-1" style={{ height: '20%' }}>
          <div className="text-gray-800 font-medium">@{userId}</div>
          <div className="text-gray-500 text-sm">{formattedDate}</div>
        </div>
      </div>

      {/* Download button - appears on hover */}
      <button
        onClick={handleDownload}
        className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 
                 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                 hover:bg-white hover:scale-110 transform"
        title="Download Polaroid"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    </div>
  );
}
