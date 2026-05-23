import React from 'react';

interface FlagProps {
  kind: 'canon' | 'legends';
  size?: 'sm' | 'md';
}

const Flag: React.FC<FlagProps> = ({ kind, size = 'md' }) => {
  const isCanon = kind === 'canon';
  const bg = isCanon ? 'rgba(75,143,217,0.15)' : 'rgba(194,85,85,0.15)';
  const border = isCanon ? 'rgba(75,143,217,0.4)' : 'rgba(194,85,85,0.4)';
  const color = isCanon ? '#4B8FD9' : '#C25555';
  const label = isCanon ? 'Canon' : 'Leyendas';
  const fontSize = size === 'sm' ? 10 : 11;
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 3,
        padding,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize,
        color,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
        }}
      />
      {label}
    </span>
  );
};

export default Flag;
