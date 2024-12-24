'use client';

import { useState, useEffect } from 'react';
import { env } from '@/app/env';
import { PortraitForm } from '@/components/ui/portrait-form';
import { PolaroidFrame } from '@/components/ui/polaroid-frame';
import { Snowfall } from '@/components/ui/snowfall';
import { Confetti } from '@/components/ui/confetti';
import { Style, Model, AvatarRef } from '@/lib/types';

interface FormData {
  userId: string;
  style: Style;
  model: Model;
}

interface ResultData {
  imageUrl: string | undefined;
  originalUrl: string | undefined;
  prompt: string | undefined;
  userId: string | undefined;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [browserLang, setBrowserLang] = useState<string>('en');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const lang = navigator.language;
    const formattedLang = lang.includes('zh') ? 'zh-Hans' : 'en';
    setBrowserLang(formattedLang);
  }, []);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const userId = data.userId.replace('@', '');
      const requestBody = {
        inputs: {
          user_id: userId,
          style: data.style.toLowerCase(),
          model: data.model,
        },
        response_mode: 'blocking',
        user: userId
      };

      console.log('Request payload:', requestBody);

      const response = await fetch(`${env.DIFY_BASE_URL}workflows/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.DIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error Response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (responseData.data?.outputs?.img?.[0]?.url) {
        setResult({
          imageUrl: responseData.data.outputs.img[0].url,
          originalUrl: responseData.data.outputs.original[0].url,
          prompt: responseData.data.outputs.prompt,
          userId: userId
        });
        setShowResult(true);
      } else {
        throw new Error('No image generated');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate portrait');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowResult(false);
  };

  if (showResult && result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-100 via-green-50 to-red-100 p-8">
        <Confetti duration={2500} />
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-8 flex items-center text-green-800 hover:text-green-900 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Generator
          </button>

          <div className="flex justify-center items-start">
            <PolaroidFrame
              imageUrl={result.imageUrl}
              originalUrl={result.originalUrl}
              userId={result.userId || ''}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-100 via-green-50 to-red-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Add Snowfall component */}
      <Snowfall />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4 relative">
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              🎄
            </span>
            Twitter Christmas Avatar
          </h1>
          <p className="text-green-700 text-lg">
            Transform your Twitter profile into a festive Christmas portrait!
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-xl p-6 mb-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <PortraitForm onSubmit={handleSubmit} isLoading={loading} />
        </div>

        {showResult && result && (
          <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-lg shadow-xl p-6">
            <PolaroidFrame 
              imageUrl={result.imageUrl} 
              originalUrl={result.originalUrl}
              userId={result.userId} 
            />
          </div>
        )}
      </div>
    </main>
  );
}