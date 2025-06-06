import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const MoroccoMadeRealLogo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  size = 'md', 
  className = '' 
}) => {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return 'h-8 w-auto';
      case 'md': return 'h-12 w-auto';
      case 'lg': return 'h-16 w-auto';
      case 'xl': return 'h-24 w-auto';
      default: return 'h-12 w-auto';
    }
  };

  const IconLogo = () => (
    <svg
      viewBox="0 0 80 80"
      className={`${getSizeClasses(size)} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Enhanced gradient backgrounds */}
      <defs>
        <linearGradient id="moroccanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="25%" stopColor="#EA580C" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="75%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      
      {/* Moroccan-inspired hexagonal background */}
      <polygon
        points="40,4 64,20 64,52 40,68 16,52 16,20"
        fill="url(#moroccanGradient)"
        stroke="#FFFFFF"
        strokeWidth="3"
        className="drop-shadow-lg"
      />
      
      {/* Inner geometric pattern */}
      <polygon
        points="40,12 56,24 56,48 40,60 24,48 24,24"
        fill="url(#innerGlow)"
        stroke="#FFFFFF"
        strokeWidth="1"
        opacity="0.7"
      />
      
      {/* Authentic Moroccan Star (8-pointed Khatam) */}
      <g transform="translate(40,40)">
        <g className="animate-pulse">
          <path
            d="M0,-14 L3,-7 L10,-10 L7,-3 L14,0 L7,3 L10,10 L3,7 L0,14 L-3,7 L-10,10 L-7,3 L-14,0 L-7,-3 L-10,-10 L-3,-7 Z"
            fill="url(#starGradient)"
            stroke="#DC2626"
            strokeWidth="1"
            className="drop-shadow-md"
          />
        </g>
        
        {/* Central compass rose for discovery */}
        <circle cx="0" cy="0" r="4" fill="#DC2626" />
        <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
        
        {/* Animated discovery dots */}
        <g opacity="0.8">
          <circle cx="-8" cy="-8" r="1.5" fill="#F59E0B">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0s" repeatCount="indefinite" />
          </circle>
          <circle cx="8" cy="-8" r="1.5" fill="#10B981">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" begin="0.7s" repeatCount="indefinite" />
          </circle>
          <circle cx="8" cy="8" r="1.5" fill="#DC2626">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="1.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="-8" cy="8" r="1.5" fill="#059669">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" begin="2.1s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* Connecting lines showing the journey */}
        <g opacity="0.5" strokeWidth="0.5" stroke="#FFFFFF">
          <line x1="-8" y1="-8" x2="8" y2="8" strokeDasharray="2,1">
            <animate attributeName="strokeDashoffset" values="0;6" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="8" y1="-8" x2="-8" y2="8" strokeDasharray="2,1">
            <animate attributeName="strokeDashoffset" values="0;-6" dur="3s" repeatCount="indefinite" />
          </line>
        </g>
      </g>
      
      {/* Decorative corners inspired by Moroccan tiles */}
      <g opacity="0.6" fill="#FFFFFF">
        <path d="M12,12 L20,12 L16,16 Z" />
        <path d="M68,12 L60,12 L64,16 Z" />
        <path d="M68,68 L60,68 L64,64 Z" />
        <path d="M12,68 L20,68 L16,64 Z" />
      </g>
      
      {/* Outer decorative ring */}
      <polygon
        points="40,2 66,18 66,54 40,70 14,54 14,18"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeDasharray="3,2"
        opacity="0.7"
      />
    </svg>
  );

  const TextLogo = () => (
    <div className={`flex flex-col ${className}`}>
      <div className="font-bold text-gray-900" style={{ 
        fontSize: size === 'xl' ? '2rem' : size === 'lg' ? '1.5rem' : size === 'md' ? '1.25rem' : '1rem',
        fontFamily: '"Playfair Display", serif'
      }}>
        <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">Morocco</span>
        <span className="text-gray-700 mx-1">Made</span>
        <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Real</span>
      </div>
      <div className="text-orange-600 font-medium text-xs tracking-wider uppercase" style={{
        fontSize: size === 'xl' ? '0.875rem' : size === 'lg' ? '0.75rem' : '0.625rem'
      }}>
        Cultural Matching
      </div>
      <div className="text-gray-500 text-xs italic" style={{
        fontSize: size === 'xl' ? '0.75rem' : '0.625rem'
      }}>
        Swipe ❤️ Match ✨ Experience
      </div>
    </div>
  );

  const FullLogo = () => (
    <div className={`flex items-center space-x-3 ${className}`}>
      <IconLogo />
      <TextLogo />
    </div>
  );

  switch (variant) {
    case 'icon':
      return <IconLogo />;
    case 'text':
      return <TextLogo />;
    case 'full':
    default:
      return <FullLogo />;
  }
};

export default MoroccoMadeRealLogo; 