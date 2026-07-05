import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 22v-8.5h2.85l.43-3.3h-3.28V8.09c0-.96.27-1.61 1.64-1.61h1.75V3.53C16.6 3.47 15.6 3.4 14.43 3.4c-2.44 0-4.11 1.49-4.11 4.22v2.35H7.46v3.3h2.86V22h3.18Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
