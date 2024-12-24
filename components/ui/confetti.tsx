'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  duration?: number;
}

export function Confetti({ duration = 3000 }: ConfettiProps) {
  useEffect(() => {
    const end = Date.now() + duration;

    const colors = ['#ff0000', '#00ff00', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    return () => {
      confetti.reset();
    };
  }, [duration]);

  return null;
}
