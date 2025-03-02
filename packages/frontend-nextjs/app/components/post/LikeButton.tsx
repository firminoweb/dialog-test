'use client';

interface LikeButtonProps {
  isLiked: boolean;
  onClick: () => void;
}

export default function LikeButton({ isLiked, onClick }: LikeButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`p-1 rounded-full transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
      aria-label={isLiked ? 'Unlike' : 'Like'}
      type="button"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={isLiked ? "currentColor" : "none"} 
        stroke="currentColor" 
        className="w-5 h-5"
        strokeWidth={isLiked ? "0" : "2"}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
}
