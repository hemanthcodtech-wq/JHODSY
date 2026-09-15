import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating?: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating = 4.8,
  count = 100,
  size = 'sm',
  showText = true
}) => {
  const starSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="flex items-center space-x-1.5 select-none">
      <div className="flex items-center space-x-0.5 text-[#F5F5F5]">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`${starSize} fill-white text-white`}
          />
        ))}
      </div>
      {showText && (
        <span className="text-[11px] text-[#AEB6C2] font-medium tracking-tight">
          {rating} {count ? `(${count})` : ''}
        </span>
      )}
    </div>
  );
};
