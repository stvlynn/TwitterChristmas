'use client';

import { useState } from 'react';
import { Style, Model, AvatarRef } from '@/lib/types';

interface PortraitFormProps {
  onSubmit: (data: { userId: string; style: Style; avatar: AvatarRef; model: Model }) => void;
  isLoading: boolean;
}

const styles: Style[] = [
  'polaroid',
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
  const [style, setStyle] = useState<Style>('polaroid');
  const [avatar, setAvatar] = useState<AvatarRef>('false');
  const [model, setModel] = useState<Model>('flux');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ userId, style, avatar, model });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
          Twitter Username
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">@</span>
          </div>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="block w-full pl-8 pr-12 py-3 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="username"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="style" className="block text-sm font-medium text-gray-700">
          Portrait Style
        </label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value as Style)}
          className="block w-full py-3 pl-3 pr-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          {styles.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="model" className="block text-sm font-medium text-gray-700">
          AI Model
        </label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value as Model)}
          className="block w-full py-3 pl-3 pr-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <option value="flux">Flux</option>
          <option value="SD">Stable Diffusion</option>
        </select>
      </div>

      <div className="flex items-center">
        <div className="relative flex items-start">
          <div className="flex items-center h-5">
            <input
              id="avatar"
              type="checkbox"
              checked={avatar === 'true'}
              onChange={(e) => setAvatar(e.target.checked ? 'true' : 'false')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="avatar" className="text-sm font-medium text-gray-700">
              Reference profile avatar
            </label>
            <p className="text-sm text-gray-500">
              Use the profile picture as a reference for the portrait
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !userId}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="mr-2 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Generate Portrait
          </>
        )}
      </button>
    </form>
  );
}