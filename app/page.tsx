'use client';

import { useState, useEffect } from 'react';
import { env } from '@/app/env';
import { PortraitForm } from '@/components/ui/portrait-form';
import { PolaroidFrame } from '@/components/ui/polaroid-frame';
import { Style, Model, AvatarRef } from '@/lib/types';

interface FormData {
  userId: string;
  style: Style;
  avatar: AvatarRef;
  model: Model;
}

interface ResultData {
  imageUrl: string | undefined;
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
          lang: browserLang,
          style: data.style.toLowerCase(),
          model: data.model,
          avatar: data.avatar
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Generator
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left side - Polaroid Image */}
              <div className="p-8 bg-gray-50 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <PolaroidFrame
                    imageUrl={result.imageUrl}
                    userId={result.userId || ''}
                  />
                </div>
              </div>

              {/* Right side - Prompt */}
              <div className="p-8 bg-white">
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Generation Prompt
                  </h3>
                  <div className="relative flex-grow bg-gray-50 rounded-xl p-6 overflow-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {result.prompt}
                    </pre>
                    <button
                      onClick={() => navigator.clipboard.writeText(result.prompt || '')}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg shadow-sm border border-gray-100 transition-colors"
                      title="Copy prompt"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Twitter Instant Portrait
            </h1>
            <p className="text-gray-600 text-lg">
              Transform Twitter profiles into stunning AI-generated portraits
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <PortraitForm onSubmit={handleSubmit} isLoading={loading} />
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center space-x-2">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Footer links */}
          <div className="mt-8 flex items-center justify-center space-x-4 flex-wrap">
            <a href="https://github.com/stvlynn/TwitterInstantPortrait" target="_blank" rel="noopener noreferrer">
              <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/stvlynn/TwitterInstantPortrait?style=flat&logo=github" />
            </a>
            <a href="https://twitter.com/stv_lynn" target="_blank" rel="noopener noreferrer">
              <img alt="X (formerly Twitter) Follow" src="https://img.shields.io/twitter/follow/stv_lynn" />
            </a>
            <a href="https://www.buymeacoffee.com/stvlynn" target="_blank" rel="noopener noreferrer">
              <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style={{ height: '20px' }} />
            </a>
            <a href="https://kimi.moonshot.cn/" target="_blank" rel="noopener noreferrer" className="inline-flex">
              <div className="bg-gray-100 rounded-md p-0.5">
                <img src="/img/moonshot-text.svg" alt="Kimi AI" style={{ height: '14px' }} />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}