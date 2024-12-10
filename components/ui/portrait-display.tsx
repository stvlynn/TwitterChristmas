'use client';

import { useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface PortraitDisplayProps {
  imageUrl?: string;
  prompt?: string;
  userId?: string;
}

export function PortraitDisplay({ imageUrl, prompt, userId }: PortraitDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!imageUrl) return null;

  return (
    <div className="space-y-4">
      <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
        <div className="absolute inset-x-0 -top-2 h-4 bg-gray-200 rounded-t-lg" />
        <div className="pt-4">
          <img
            src={imageUrl}
            alt="Generated Portrait"
            className="w-full aspect-square object-cover rounded-sm"
          />
          <div className="mt-4 text-center space-y-1">
            <p className="font-medium">@{userId}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {prompt && (
        <div className="bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
          <div className="flex items-start justify-between">
            <p className="text-sm text-gray-700 flex-1 mr-4">{prompt}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="flex-shrink-0"
            >
              <Copy className={copied ? 'text-green-500' : 'text-gray-500'} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}