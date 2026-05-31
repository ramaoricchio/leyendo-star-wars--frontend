import React, { useState } from 'react';
import { ReadingStatusValue } from '../../types/readingStatus';
import { useReadingStatus } from '../../context/ReadingStatusContext';
import { useAuth } from '../../context/AuthContext';

interface Props {
  publicationId: number;
  children: React.ReactNode;
  onNavigate?: () => void;
}

const STATUS_OPTIONS: { value: ReadingStatusValue; label: string; icon: string }[] = [
  { value: 'no_leido',  label: 'No leído', icon: '○' },
  { value: 'leyendo',   label: 'Leyendo',  icon: '◑' },
  { value: 'leido',     label: 'Leído',    icon: '●' },
];

const STATUS_COLORS: Record<ReadingStatusValue, string> = {
  no_leido: 'rgba(156,151,136,0.5)',
  leyendo:  '#4B8FD9',
  leido:    '#C9A84C',
};

const ReadingStatusOverlay: React.FC<Props> = ({ publicationId, children, onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const { getStatus, updateStatus } = useReadingStatus();
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = getStatus(publicationId);
  const currentStatus: ReadingStatusValue = status?.status ?? 'no_leido';
  const inWishlist = status?.in_wishlist ?? false;

  const handleStatus = async (e: React.MouseEvent, value: ReadingStatusValue) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    await updateStatus(publicationId, { status: value });
    setLoading(false);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    await updateStatus(publicationId, { in_wishlist: !inWishlist });
    setLoading(false);
  };

  const showIndicator = isAuthenticated && (currentStatus !== 'no_leido' || inWishlist);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      {/* Passive indicator — small colored bar at bottom when not hovered */}
      {showIndicator && !hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            borderRadius: '0 0 4px 4px',
            background: STATUS_COLORS[currentStatus],
            transition: 'opacity 0.15s',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Wishlist heart when not hovered */}
      {isAuthenticated && inWishlist && !hovered && (
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: 6,
            fontSize: 12,
            color: '#C9A84C',
            pointerEvents: 'none',
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          }}
        >
          ♥
        </div>
      )}

      {/* Hover overlay */}
      {isAuthenticated && hovered && (
        <div
          onClick={(e) => { e.stopPropagation(); onNavigate?.(); }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 4,
            background: 'rgba(10,10,15,0.88)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '10px 8px',
            backdropFilter: 'blur(2px)',
          }}
        >
          {onNavigate && (
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate(); }}
              style={{
                width: '100%',
                padding: '4px 0',
                border: 'none',
                borderRadius: 3,
                background: 'transparent',
                color: '#C9A84C',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                cursor: 'pointer',
                letterSpacing: '0.06em',
                marginBottom: 2,
              }}
            >
              ver →
            </button>
          )}
          {STATUS_OPTIONS.map((opt) => {
            const active = currentStatus === opt.value;
            return (
              <button
                key={opt.value}
                onClick={(e) => handleStatus(e, opt.value)}
                style={{
                  width: '100%',
                  padding: '5px 0',
                  border: `1px solid ${active ? '#C9A84C' : 'rgba(242,238,223,0.15)'}`,
                  borderRadius: 3,
                  background: active ? 'rgba(201,168,76,0.18)' : 'transparent',
                  color: active ? '#C9A84C' : 'rgba(242,238,223,0.6)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  transition: 'all 0.1s',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                <span style={{ fontSize: 10 }}>{opt.icon}</span>
                {opt.label}
              </button>
            );
          })}

          <div style={{ width: '100%', height: 1, background: 'rgba(242,238,223,0.08)', margin: '2px 0' }} />

          <button
            onClick={handleWishlist}
            style={{
              width: '100%',
              padding: '5px 0',
              border: `1px solid ${inWishlist ? '#C9A84C' : 'rgba(242,238,223,0.15)'}`,
              borderRadius: 3,
              background: inWishlist ? 'rgba(201,168,76,0.18)' : 'transparent',
              color: inWishlist ? '#C9A84C' : 'rgba(242,238,223,0.6)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              transition: 'all 0.1s',
              opacity: loading ? 0.5 : 1,
            }}
          >
            <span>{inWishlist ? '♥' : '♡'}</span>
            {inWishlist ? 'En tu lista' : 'Lista de deseos'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadingStatusOverlay;
