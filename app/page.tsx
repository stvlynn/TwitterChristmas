'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import { PortraitForm } from '@/components/ui/portrait-form';
import { PortraitDisplay } from '@/components/ui/portrait-display';
import { Style } from '@/lib/types';
import { generatePortrait } from '@/lib/api';
import { ToastMessage } from '@/components/ui/toast-message';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portrait, setPortrait] = useState<{
    imageUrl?: string;
    prompt?: string;
    userId?: string;
  }>({});

  const handleGeneratePortrait = async (userId: string, style: Style, avatar: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await generatePortrait(userId, style, avatar);
      setPortrait({
        imageUrl: data.data.outputs.img[0].url,
        prompt: data.data.outputs.prompt,
        userId,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      setPortrait({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Camera className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Twitter Instant Portrait</h1>
          </div>
          <p className="text-gray-600">
            Generate beautiful AI portraits from Twitter profiles
          </p>
        </div>

        <PortraitForm onSubmit={handleGeneratePortrait} isLoading={loading} />
        
        <PortraitDisplay
          imageUrl={portrait.imageUrl}
          prompt={portrait.prompt}
          userId={portrait.userId}
        />

        {error && <ToastMessage message={error} type="error" />}
      </div>
    </main>
  );
}