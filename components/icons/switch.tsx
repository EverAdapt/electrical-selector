import React from 'react';

export function IconSwitch1Gang(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="7" y="7" width="10" height="10" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconSwitch2Gang(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="5" y="7" width="14" height="10" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <line x1="9" y1="10" x2="9" y2="14" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      <circle cx="9" cy="10" r="0.8" fill="currentColor" />
      <line x1="15" y1="10" x2="15" y2="14" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      <circle cx="15" cy="10" r="0.8" fill="currentColor" />
      <line x1="12" y1="7" x2="12" y2="17" stroke="currentColor" strokeWidth={0.5} />
    </svg>
  );
}

export function IconSwitch3Gang(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="4" y="7" width="16" height="10" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <line x1="7.5" y1="10" x2="7.5" y2="14" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      <circle cx="7.5" cy="10" r="0.6" fill="currentColor" />
      <line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      <circle cx="12" cy="10" r="0.6" fill="currentColor" />
      <line x1="16.5" y1="10" x2="16.5" y2="14" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      <circle cx="16.5" cy="10" r="0.6" fill="currentColor" />
      <line x1="9.5" y1="7" x2="9.5" y2="17" stroke="currentColor" strokeWidth={0.5} />
      <line x1="14.5" y1="7" x2="14.5" y2="17" stroke="currentColor" strokeWidth={0.5} />
    </svg>
  );
}

export function IconSwitch4Gang(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="3" y="7" width="18" height="10" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <line x1="6" y1="10" x2="6" y2="14" stroke="currentColor" strokeWidth={1} strokeLinecap="round" />
      <circle cx="6" cy="10" r="0.5" fill="currentColor" />
      <line x1="9.5" y1="10" x2="9.5" y2="14" stroke="currentColor" strokeWidth={1} strokeLinecap="round" />
      <circle cx="9.5" cy="10" r="0.5" fill="currentColor" />
      <line x1="14.5" y1="10" x2="14.5" y2="14" stroke="currentColor" strokeWidth={1} strokeLinecap="round" />
      <circle cx="14.5" cy="10" r="0.5" fill="currentColor" />
      <line x1="18" y1="10" x2="18" y2="14" stroke="currentColor" strokeWidth={1} strokeLinecap="round" />
      <circle cx="18" cy="10" r="0.5" fill="currentColor" />
      <line x1="7.75" y1="7" x2="7.75" y2="17" stroke="currentColor" strokeWidth={0.5} />
      <line x1="12" y1="7" x2="12" y2="17" stroke="currentColor" strokeWidth={0.5} />
      <line x1="16.25" y1="7" x2="16.25" y2="17" stroke="currentColor" strokeWidth={0.5} />
    </svg>
  );
}

export function IconSwitchDimmer(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="7" y="7" width="10" height="10" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth={1.5} />
      <path d="M 10 12 A 2 2 0 0 1 14 12" fill="none" stroke="currentColor" strokeWidth={1.5} />
      <line x1="12" y1="9.5" x2="12" y2="8" stroke="currentColor" strokeWidth={1} />
    </svg>
  );
}
