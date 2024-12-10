'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Style } from '@/lib/types';

interface PortraitFormProps {
  onSubmit: (userId: string, style: Style, avatar: boolean) => void;
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
  const [style, setStyle] = useState<Style>('realistic');
  const [avatar, setAvatar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(userId, style, avatar);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-medium">@</span>
        <Input
          placeholder="Twitter ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="flex-1"
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-full w-12 h-12 bg-white hover:bg-gray-100 shadow-lg"
        >
          <Camera className="h-6 w-6 text-black" />
        </Button>
      </div>

      <div className="space-y-4">
        <RadioGroup value={style} onValueChange={(value) => setStyle(value as Style)}>
          <div className="grid grid-cols-4 gap-4">
            {styles.map((s) => (
              <div key={s} className="flex items-center space-x-2">
                <RadioGroupItem value={s} id={s} />
                <Label htmlFor={s} className="capitalize">
                  {s.replace('-', ' ')}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="flex items-center space-x-2">
          <Switch
            id="avatar"
            checked={avatar}
            onCheckedChange={setAvatar}
          />
          <Label htmlFor="avatar">Use profile picture as reference</Label>
        </div>
      </div>
    </form>
  );
}