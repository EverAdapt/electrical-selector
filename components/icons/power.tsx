import React from 'react';

export function IconPowerSingle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10" fill="none" strokeWidth={1.5} stroke="currentColor" />
      <rect x="8" y="10" width="8" height="4" rx="0.5" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <line x1="10" y1="10" x2="10" y2="8" stroke="currentColor" strokeWidth={1.5} />
      <line x1="14" y1="10" x2="14" y2="8" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}

export function IconPowerDouble(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10" fill="none" strokeWidth={1.5} stroke="currentColor" />
      <rect x="6" y="10" width="5" height="4" rx="0.5" stroke="currentColor" strokeWidth={1.2} fill="none" />
      <rect x="13" y="10" width="5" height="4" rx="0.5" stroke="currentColor" strokeWidth={1.2} fill="none" />
      <line x1="7.5" y1="10" x2="7.5" y2="8" stroke="currentColor" strokeWidth={1.2} />
      <line x1="9.5" y1="10" x2="9.5" y2="8" stroke="currentColor" strokeWidth={1.2} />
      <line x1="14.5" y1="10" x2="14.5" y2="8" stroke="currentColor" strokeWidth={1.2} />
      <line x1="16.5" y1="10" x2="16.5" y2="8" stroke="currentColor" strokeWidth={1.2} />
    </svg>
  );
}
