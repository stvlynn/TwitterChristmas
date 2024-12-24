'use client';

import { useState } from 'react';
import { Style, Model } from '@/lib/types';

interface PortraitFormProps {
  onSubmit: (data: { userId: string; style: Style; model: Model }) => void;
  isLoading: boolean;
}

const styles: Style[] = [
  'realistic',
  'anime',
  'watercolor',
  'oil-painting',
  'pencil-sketch',
  'pop-art',
  'cyberpunk',
];

export function PortraitForm({ onSubmit, isLoading }: PortraitFormProps) {
  const [userId, setUserId] = useState('');
  const [style, setStyle] = useState<Style>('anime');
  const [model, setModel] = useState<Model>('flux');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ userId, style, model });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="userId" className="block text-sm font-medium text-green-800">
          Twitter Username
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-red-500 sm:text-sm">@</span>
          </div>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="block w-full pl-8 pr-12 py-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white/90 backdrop-blur-sm"
            placeholder="username"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="style" className="block text-sm font-medium text-green-800">
          Portrait Style
        </label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value as Style)}
          className="block w-full py-3 pl-3 pr-10 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white/90 backdrop-blur-sm"
        >
          {styles.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="model" className="block text-sm font-medium text-green-800">
          Image Generation Model
        </label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value as Model)}
          className="block w-full py-3 pl-3 pr-10 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white/90 backdrop-blur-sm"
        >
          <option value="flux">Flux</option>
          <option value="SD">Stable Diffusion</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center px-4 py-3 border-2 text-base font-medium rounded-md text-white 
          ${isLoading ? 'bg-red-400 border-red-300' : 'bg-red-600 hover:bg-red-700 border-red-500'} 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg transform transition-all duration-200 hover:scale-[1.02]`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Generating Christmas Avatar...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"/>
            </svg>
            Generate Christmas Avatar
          </>
        )}
      </button>

      <a
        href="https://twi.am"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full inline-flex items-center justify-center px-4 py-3 border-2 border-green-300 text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-[1.02] shadow-md"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
        </svg>
        More Analysis
      </a>
    </form>
  );
}