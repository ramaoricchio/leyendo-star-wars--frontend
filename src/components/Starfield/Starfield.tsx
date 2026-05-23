import React from 'react';

interface StarfieldProps {
  density?: number;
  opacity?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const Starfield: React.FC<StarfieldProps> = ({ density = 1, opacity = 1 }) => {
  const count = Math.floor(120 * density);
  const rand = seededRandom(7);
  const stars: { x: number; y: number; r: number; o: number }[] = [];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      r: rand() * 1.2 + 0.3,
      o: rand() * 0.7 + 0.2,
    });
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.07" />
            <stop offset="60%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#vignette)" />
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill="#F2EEDF"
            opacity={s.o * opacity}
          />
        ))}
      </svg>
    </div>
  );
};

export default Starfield;
