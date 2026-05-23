import React from 'react';

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  action?: string;
  onAction?: () => void;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ kicker, title, action, onAction }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 32,
      }}
    >
      <div>
        {kicker && (
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: '#C9A84C',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}
          >
            {`// ${kicker}`}
          </div>
        )}
        <h2
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: 36,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            color: '#F2EEDF',
            lineHeight: 1,
          }}
        >
          {title}
        </h2>
      </div>
      {action && onAction && (
        <button
          onClick={onAction}
          style={{
            background: 'none',
            border: 'none',
            color: '#C9A84C',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: 0,
            opacity: 0.85,
          }}
        >
          {action} →
        </button>
      )}
    </div>
  );
};

export default SectionHeading;
