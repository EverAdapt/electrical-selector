import React from 'react';

export function IconLightCeiling(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10" fill="none" strokeWidth={1.5} stroke="currentColor" />
      <circle cx="12" cy="12" r="4" fill="none" strokeWidth={1.5} stroke="currentColor" />
      <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth={1.5} />
      <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth={1.5} />
      <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth={1.5} />
      <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth={1.5} />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" stroke="currentColor" strokeWidth={1.5} />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth={1.5} />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" stroke="currentColor" strokeWidth={1.5} />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}

export function IconLightWall(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10" fill="none" strokeWidth={1.5} stroke="currentColor" />
      <path 
        d="M 8 12 L 12 8 L 16 12 L 12 16 Z" 
        fill="none" 
        strokeWidth={1.5} 
        stroke="currentColor" 
      />
      <line x1="12" y1="6" x2="12" y2="8" stroke="currentColor" strokeWidth={1.5} />
      <line x1="12" y1="16" x2="12" y2="18" stroke="currentColor" strokeWidth={1.5} />
      <line x1="6" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth={1.5} />
      <line x1="16" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}
