'use client';

import { useState, useEffect } from 'react';
import { env } from '@/app/env';
import { PortraitForm } from '@/components/ui/portrait-form';
import { Style, Model, AvatarRef } from '@/lib/types';

interface FormData {
  userId: string;
  style: Style;
  avatar: AvatarRef;
  model: Model;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imageUrl?: string; prompt?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [browserLang, setBrowserLang] = useState<string>('en');

  useEffect(() => {
    // Get browser language and format it to match Dify's expected format
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
        user: userId // Ensure user matches user_id
      };

      console.log('Request payload:', requestBody); // For debugging

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
          prompt: responseData.data.outputs.prompt
        });
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Twitter Instant Portrait
            </h1>
            <p className="text-gray-600 text-lg">
              Transform Twitter profiles into stunning AI-generated portraits
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 h-fit">
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

            {/* Right Column - Result */}
            <div className={`relative ${!result ? 'hidden lg:block' : ''}`}>
              {!result && !loading && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="w-24 h-24 mx-auto mb-4">
                      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-lg">Your portrait will appear here</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in">
                  <div className="aspect-[3/4] relative overflow-hidden rounded-xl mb-6 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.imageUrl}
                      alt="Generated portrait"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {result.prompt && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Generation Prompt
                      </h3>
                      <div className="relative">
                        <pre className="text-sm bg-gray-50 p-4 rounded-xl whitespace-pre-wrap text-gray-700 border border-gray-100">
                          {result.prompt}
                        </pre>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(result.prompt);
                          }}
                          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg shadow-sm border border-gray-100 transition-colors"
                          title="Copy prompt"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4">
                      <div className="w-full h-full border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600">Generating your portrait...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}