import { CSSProperties } from 'react';
import Image from 'next/image';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
  className?: string;
  onClick?: () => void;
}

export default function Avatar({ src, alt, size = 'md', className = '', onClick }: AvatarProps) {
  // Mapear tamanhos
  const sizeMap: Record<AvatarSize, { size: number, className: string }> = {
    xs: { size: 24, className: 'w-6 h-6' },
    sm: { size: 32, className: 'w-8 h-8' },
    md: { size: 40, className: 'w-10 h-10' },
    lg: { size: 64, className: 'w-16 h-16' },
    xl: { size: 96, className: 'w-24 h-24' },
  };

  const { className: sizeClassName, size: pixelSize } = sizeMap[size];

  return (
    <div 
      className={`relative rounded-full overflow-hidden ${sizeClassName} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {src.startsWith('http') || src.startsWith('/') ? (
        <Image 
          src={src} 
          alt={alt}
          width={pixelSize}
          height={pixelSize}
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-800 font-medium">
          {alt.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
}
