'use client';

import React, { useState, useEffect } from 'react';

interface AnimatedArtisanProps {
  craftType: string;
  size?: 'sm' | 'md' | 'lg';
}

const ArtisanAnimations = {
  pottery: {
    frames: ['🏺', '👐', '🤲', '✋', '🏺'],
    description: 'Potter shaping clay on wheel'
  },
  weaving: {
    frames: ['🧵', '👩‍🎨', '🪡', '✋', '🧵'],
    description: 'Weaver working traditional loom'
  },
  cooking: {
    frames: ['🍲', '👩‍🍳', '🥄', '✋', '🍲'],
    description: 'Chef preparing traditional tagine'
  },
  leather: {
    frames: ['👜', '👨‍🎨', '🔨', '✋', '👜'],
    description: 'Leather artisan crafting'
  },
  metalwork: {
    frames: ['⚒️', '👨‍🏭', '🔥', '✋', '⚒️'],
    description: 'Metalsmith forging'
  },
  carpet: {
    frames: ['🪶', '👩‍🎨', '🧶', '✋', '🪶'],
    description: 'Carpet weaver at work'
  }
};

export default function AnimatedArtisan({ craftType, size = 'md' }: AnimatedArtisanProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const animation = ArtisanAnimations[craftType as keyof typeof ArtisanAnimations] || ArtisanAnimations.pottery;
  
  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl'
  };

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % animation.frames.length);
    }, 800);

    return () => clearInterval(interval);
  }, [isAnimating, animation.frames.length]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Main animated artisan */}
      <div
        className={`${sizeClasses[size]} cursor-pointer select-none transition-transform hover:scale-110`}
        onClick={() => setIsAnimating(!isAnimating)}
        title={animation.description}
        style={{
          animation: isAnimating ? 'pulse 2s infinite' : 'none'
        }}
      >
        {animation.frames[currentFrame]}
      </div>

      {/* Craft indicator */}
      <div 
        className="absolute -bottom-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
        style={{
          animation: isAnimating ? 'bounce 1.6s infinite' : 'none'
        }}
      >
        <span className="text-white text-xs">🎨</span>
      </div>

      {/* Working particles */}
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                animation: `float-${i} 2s infinite ${i * 0.3}s ease-out`
              }}
            />
          ))}
        </div>
      )}

      {/* Skill level indicator */}
      <div className="absolute -top-2 -left-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className="text-yellow-400 text-xs"
              style={{
                animation: isAnimating ? `twinkle 0.5s infinite ${star * 0.1}s` : 'none'
              }}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float-0 {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-30px, -30px) scale(1); opacity: 1; }
          100% { transform: translate(-60px, -60px) scale(0); opacity: 0; }
        }
        @keyframes float-1 {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(20px, -40px) scale(1); opacity: 1; }
          100% { transform: translate(40px, -80px) scale(0); opacity: 0; }
        }
        @keyframes float-2 {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-10px, 25px) scale(1); opacity: 1; }
          100% { transform: translate(-20px, 50px) scale(0); opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
} 