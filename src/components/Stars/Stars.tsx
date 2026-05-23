import React from 'react';

interface StarsProps {
  value: number;
  max?: number;
  size?: number;
  color?: string;
}

const Stars: React.FC<StarsProps> = ({ value, max = 5, size = 14, color = '#C9A84C' }) => {
  return (
    <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
      {[...Array(max)].map((_, i) => {
        const filled = i < Math.floor(value);
        const partial = !filled && i < value;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {partial ? (
              <>
                <defs>
                  <linearGradient id={`star-partial-${i}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset={`${(value - Math.floor(value)) * 100}%`} stopColor={color} />
                    <stop offset={`${(value - Math.floor(value)) * 100}%`} stopColor="rgba(201,168,76,0.2)" />
                  </linearGradient>
                </defs>
                <polygon
                  points="8,1.5 10.09,6.26 15.27,6.9 11.5,10.47 12.55,15.6 8,12.97 3.45,15.6 4.5,10.47 0.73,6.9 5.91,6.26"
                  fill={`url(#star-partial-${i})`}
                />
              </>
            ) : (
              <polygon
                points="8,1.5 10.09,6.26 15.27,6.9 11.5,10.47 12.55,15.6 8,12.97 3.45,15.6 4.5,10.47 0.73,6.9 5.91,6.26"
                fill={filled ? color : 'rgba(201,168,76,0.2)'}
              />
            )}
          </svg>
        );
      })}
    </span>
  );
};

export default Stars;
