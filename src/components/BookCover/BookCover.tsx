import React from 'react';
import { ToneKey } from '../../types/publication';

const TONES: Record<ToneKey, [string, string]> = {
  A: ['#2a1a3e', '#5b2d6e'],
  B: ['#3a2a1a', '#6e4a2d'],
  C: ['#1a3a3e', '#2d5b6e'],
  D: ['#3a1a1a', '#6e2d2d'],
  E: ['#1a2a3a', '#2d4a6e'],
  F: ['#2a2a1a', '#5b5b2d'],
  G: ['#1c1c24', '#34344a'],
  H: ['#1a3a2a', '#2d6e4a'],
};

interface BookCoverProps {
  title: string;
  author?: string;
  kind: 'canon' | 'legends';
  tone?: ToneKey;
  w?: number;
  ratio?: number;
  year?: number;
  code?: string;
  badge?: boolean;
}

const BookCover: React.FC<BookCoverProps> = ({
  title,
  author,
  kind,
  tone = 'G',
  w = 120,
  ratio = 1.5,
  year,
  code,
  badge = true,
}) => {
  const h = Math.round(w * ratio);
  const [dark, light] = TONES[tone];
  const dotColor = kind === 'canon' ? '#4B8FD9' : '#C25555';

  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        background: `linear-gradient(160deg, ${dark} 0%, ${light} 100%)`,
        boxShadow: '4px 4px 16px rgba(0,0,0,0.6)',
      }}
    >
      {/* Spine highlight */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)',
        }}
      />
      {/* Canon/Legends dot */}
      {badge && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: dotColor,
            boxShadow: `0 0 6px ${dotColor}`,
          }}
        />
      )}
      {/* Year / code */}
      {(year || code) && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: 'rgba(242,238,223,0.5)',
            letterSpacing: '0.06em',
          }}
        >
          {code || year}
        </div>
      )}
      {/* Decorative lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
          opacity: 0.15,
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              width: '60%',
              height: 1,
              background: 'rgba(201,168,76,0.6)',
            }}
          />
        ))}
      </div>
      {/* Bottom info */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 8px 8px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
        }}
      >
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 500,
            fontSize: Math.max(8, w / 14),
            color: '#F2EEDF',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </div>
        {author && (
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: Math.max(7, w / 18),
              color: 'rgba(242,238,223,0.55)',
              marginTop: 2,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {author}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCover;
