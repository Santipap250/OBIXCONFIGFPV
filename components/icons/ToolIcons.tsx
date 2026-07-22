import type { SVGProps } from "react";

/**
 * OBIXCONFIG FPV — instrument icon set.
 *
 * One shared visual language across all six tools: a pointy-top hex frame
 * (echoes the OBIX brand mark) containing a single-purpose line glyph.
 * Icons use `currentColor`, so they inherit the tool's accent color and
 * can be recolored per light/dark context from CSS alone. Pair with the
 * `.icon-glow` utility (see globals.css) for the neon drop-shadow used
 * throughout the product UI.
 */

const HEX_POINTS = "55.4,45.5 32,59 8.6,45.5 8.6,18.5 32,5 55.4,18.5";

type IconProps = SVGProps<SVGSVGElement> & { frame?: boolean };

function Frame({ frame = true }: { frame?: boolean }) {
  if (!frame) return null;
  return <polygon points={HEX_POINTS} fill="none" strokeWidth={2.6} strokeLinejoin="round" />;
}

const shared = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PidIcon({ frame, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" stroke="currentColor" {...props}>
      <Frame frame={frame} />
      <g {...shared}>
        <line x1="22" y1="19" x2="22" y2="45" />
        <line x1="32" y1="19" x2="32" y2="45" />
        <line x1="42" y1="19" x2="42" y2="45" />
        <circle cx="22" cy="31" r="3.4" fill="currentColor" stroke="none" />
        <circle cx="32" cy="39" r="3.4" fill="currentColor" stroke="none" />
        <circle cx="42" cy="25" r="3.4" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

export function BlackboxIcon({ frame, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" stroke="currentColor" {...props}>
      <Frame frame={frame} />
      <g {...shared}>
        <path d="M12,32 L18,32 L21,20 L25,45 L29,23 L33,32 L38,32" />
        <circle cx="46" cy="32" r="7.5" />
        <line x1="46" y1="26.5" x2="46" y2="29.5" />
        <line x1="46" y1="34.5" x2="46" y2="37.5" />
        <line x1="40.5" y1="32" x2="43.5" y2="32" />
        <line x1="48.5" y1="32" x2="51.5" y2="32" />
      </g>
    </svg>
  );
}

export function BuildIcon({ frame, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" stroke="currentColor" {...props}>
      <Frame frame={frame} />
      <g {...shared}>
        <line x1="18" y1="18" x2="46" y2="46" />
        <line x1="46" y1="18" x2="18" y2="46" />
        <circle cx="18" cy="18" r="3.2" fill="currentColor" stroke="none" />
        <circle cx="46" cy="18" r="3.2" fill="currentColor" stroke="none" />
        <circle cx="18" cy="46" r="3.2" fill="currentColor" stroke="none" />
        <circle cx="46" cy="46" r="3.2" fill="currentColor" stroke="none" />
        <circle cx="32" cy="32" r="3.6" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

export function RatesIcon({ frame, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" stroke="currentColor" {...props}>
      <Frame frame={frame} />
      <g {...shared}>
        <path d="M16,18 V46 H46" opacity={0.55} />
        <path d="M16,44 C25,44 24,32 32,32 C40,32 39,20 48,20" />
      </g>
    </svg>
  );
}

export function FlightIcon({ frame, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" stroke="currentColor" {...props}>
      <Frame frame={frame} />
      <g {...shared}>
        <path d="M32,14 L46,19.5 V30 C46,40.5 40.5,47 32,50.5 C23.5,47 18,40.5 18,30 V19.5 Z" />
        <path d="M23.5,32 L29.5,38 L40.5,24" />
      </g>
    </svg>
  );
}

export function PresetsIcon({ frame, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" stroke="currentColor" {...props}>
      <Frame frame={frame} />
      <g {...shared}>
        <path
          d="M32,12.5 L34.4,17.6 L40,18.3 L35.9,22.1 L37,27.7 L32,25 L27,27.7 L28.1,22.1 L24,18.3 L29.6,17.6 Z"
          fill="currentColor"
          stroke="none"
        />
        <path d="M20,34 L32,40 L44,34" />
        <path d="M20,42 L32,48 L44,42" />
      </g>
    </svg>
  );
}

export const toolIcons = {
  pid: PidIcon,
  blackbox: BlackboxIcon,
  build: BuildIcon,
  rates: RatesIcon,
  flight: FlightIcon,
  presets: PresetsIcon,
} as const;

export type ToolIconKey = keyof typeof toolIcons;
