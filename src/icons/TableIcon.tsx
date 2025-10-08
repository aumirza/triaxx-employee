import React, { useState, useEffect, useId } from "react";


// --- Type Definitions ---
type TableIconSize = 'small' | 'medium' | 'long';
export interface StatusProp {
  text: string;
  color?: string;       // Badge background color
  textColor?: string;   // Badge text color
}
interface TableIconProps extends React.SVGProps<SVGSVGElement> {
  size: TableIconSize;
  label: string | number;
  status?: StatusProp;         // Optional status object with text and colors
  timer?: number;              // Optional: Initial timer duration in SECONDS
  icon?: React.ReactNode;      // A single, optional icon for either status or timer
}

// --- The Main Component ---
export function TableIcon({
  size,
  label,
  status,
  timer,
  icon,
  ...props
}: TableIconProps) {
  const uniqueId = useId();
  const config = sizeConfigs[size];

  // --- Live Timer State and Effect ---
  const [remainingTime, setRemainingTime] = useState(timer || 0);

  useEffect(() => {
    if (!timer || timer <= 0) {
      setRemainingTime(0);
      return;
    }
    setRemainingTime(timer);
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // --- Dynamic Positioning and Styling ---
  const isTimerActive = timer !== undefined && remainingTime > 0;
  const isBadgeVisible = !!(status || isTimerActive);

  // If a badge is visible, move the circle up by 15px. Otherwise, keep it centered.
  const circleY = isBadgeVisible ? 48.5 : 63.5;
  const labelY = circleY + 25; // Center of the circle's new position

  // --- Render Logic ---
  const renderBadge = () => {
    if (!isBadgeVisible) return null;

    let badgeText, badgeColor, textColor;

    if (isTimerActive) {
      badgeText = formatTime(remainingTime);
      badgeColor = "#C518004D"; // Default timer color
      textColor = "#C51800";
    } else if (status) {
      badgeText = status.text;
      badgeColor = status.color || "#E9E1F9"; // Use provided color or default
      textColor = status.textColor || "#6A1B9A";
    } else {
        return null; // Should not happen due to isBadgeVisible check
    }

    const badgeWidth = icon ? badgeText.length * 10 + 45 : badgeText.length * 10 + 20;
    const badgeX = (config.width - badgeWidth) / 2;
    const textX = config.width / 2 + (icon ? 12 : 0);

    return (
      <g>
        <rect x={badgeX} y={104} width={badgeWidth} height={32} fill={badgeColor} rx="16" />
        {icon && <g transform={`translate(${badgeX + 10}, 110)`}>{icon}</g>}
        <text x={textX} y={121} fill={textColor} fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
          {badgeText}
        </text>
      </g>
    );
  };
  
  const elements = config.getElements(uniqueId);
  const bodyFillId = size === 'long' ? `${uniqueId}-paint4` : (size === 'small' ? `${uniqueId}-paint1` : `${uniqueId}-paint2`);
  const circleFillId = size === 'long' ? `${uniqueId}-paint5` : (size === 'small' ? `${uniqueId}-paint2` : `${uniqueId}-paint3`);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={config.width}
      height={config.height}
      fill="none"
      viewBox={config.viewBox}
      {...props}
    >
      {elements}
      <rect width={config.body.width} height="116" x={config.body.x} y="30" fill={`url(#${bodyFillId})`} fillOpacity="0.1" rx="16" />
      
      {/* Circle with dynamic Y position */}
      <rect width="50" height="50" x={config.circle.x} y={circleY} fill={`url(#${circleFillId})`} rx="25" />
      
      {/* Label with dynamic Y position */}
      {label && (
        <text x={config.circle.x + 25} y={labelY} fill="white" fontSize="18" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
          {label}
        </text>
      )}

      {/* Dynamic Badge */}
      {renderBadge()}
    </svg>
  );
}


// --- Full configuration object (for copy-pasting) ---
const sizeConfigs = {
  small: {
    width: 176, height: 176, viewBox: "0 0 176 176", body: { width: 140, x: 18 }, circle: { x: 63.5 },
    getElements: (id: string) => (<><path fill={`url(#${id}-paint0)`} fillOpacity="0.1" d="M62.5 22h51v-6c0-8.837-7.163-16-16-16h-19c-8.837 0-16 7.163-16 16z" /><path fill={`url(#${id}-paint3)`} fillOpacity="0.1" d="M62.5 154h51v6c0-8.837-7.163 16-16 16h-19c-8.837 0-16-7.163-16-16z" /><defs><linearGradient id={`${id}-paint0`} x1="88" x2="88" y1="22" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint1`} x1="88" x2="88" y1="30" y2="146" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint2`} x1="88.5" x2="88.5" y1="63.5" y2="113.5" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint3`} x1="88" x2="88" y1="154" y2="176" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient></defs></>),
  },
  medium: {
    width: 176, height: 176, viewBox: "0 0 176 176", body: { width: 176, x: 0 }, circle: { x: 63.5 },
    getElements: (id:string) => (<><path fill={`url(#${id}-paint0)`} fillOpacity="0.1" d="M18 22h51v-6c0-8.837-7.163-16-16-16H34c-8.837 0-16 7.163-16 16z" /><path fill={`url(#${id}-paint1)`} fillOpacity="0.1" d="M107 22h51v-6c0-8.837-7.163-16-16-16h-19c-8.837 0-16 7.163-16 16z" /><path fill={`url(#${id}-paint4)`} fillOpacity="0.1" d="M18 154h51v6c0-8.837-7.163 16-16 16H34c-8.837 0-16-7.163-16-16z" /><path fill={`url(#${id}-paint5)`} fillOpacity="0.1" d="M107 154h51v6c0-8.837-7.163 16-16 16h-19c-8.837 0-16-7.163-16-16z" /><defs><linearGradient id={`${id}-paint0`} x1="43.5" x2="43.5" y1="22" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint1`} x1="132.5" x2="132.5" y1="22" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint2`} x1="88" x2="88" y1="30" y2="146" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint3`} x1="88.5" x2="88.5" y1="63.5" y2="113.5" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint4`} x1="43.5" x2="43.5" y1="154" y2="176" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint5`} x1="132.5" x2="132.5" y1="154" y2="176" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient></defs></>),
  },
  long: {
    width: 350, height: 176, viewBox: "0 0 350 176", body: { width: 350, x: 0 }, circle: { x: 150.5 },
    getElements: (id:string) => (<><path fill={`url(#${id}-paint0)`} fillOpacity="0.1" d="M16 22h51v-6c0-8.837-7.163-16-16-16H32c-8.837 0-16 7.163-16 16z" /><path fill={`url(#${id}-paint1)`} fillOpacity="0.1" d="M105 22h51v-6c0-8.837-7.163-16-16-16h-19c-8.837 0-16 7.163-16 16z" /><path fill={`url(#${id}-paint2)`} fillOpacity="0.1" d="M194 22h51v-6c0-8.837-7.163-16-16-16h-19c-8.837 0-16 7.163-16 16z" /><path fill={`url(#${id}-paint3)`} fillOpacity="0.1" d="M283 22h51v-6c0-8.837-7.163-16-16-16h-19c-8.837 0-16 7.163-16 16z" /><path fill={`url(#${id}-paint6)`} fillOpacity="0.1" d="M16 154h51v6c0-8.837-7.163 16-16 16H32c-8.837 0-16-7.163-16-16z" /><path fill={`url(#id-paint7)`} fillOpacity="0.1" d="M105 154h51v6c0-8.837-7.163 16-16 16h-19c-8.837 0-16-7.163-16-16z" /><path fill={`url(#${id}-paint8)`} fillOpacity="0.1" d="M194 154h51v6c0-8.837-7.163 16-16 16h-19c-8.837 0-16-7.163-16-16z" /><path fill={`url(#${id}-paint9)`} fillOpacity="0.1" d="M283 154h51v6c0-8.837-7.163 16-16 16h-19c-8.837 0-16-7.163-16-16z" /><defs><linearGradient id={`${id}-paint0`} x1="41.5" x2="41.5" y1="22" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint1`} x1="130.5" x2="130.5" y1="22" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint2`} x1="219.5" x2="219.5" y1="22" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint3`} x1="308.5" x2="308.5" y1="22" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint4`} x1="175" x2="175" y1="30" y2="146" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint5`} x1="175.5" x2="175.5" y1="63.5" y2="113.5" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint6`} x1="41.5" x2="41.5" y1="154" y2="176" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint7`} x1="130.5" x2="130.5" y1="154" y2="176" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint8`} x1="219.5" x2="219.5" y1="154" y2="176" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient><linearGradient id={`${id}-paint9`} x1="308.5" x2="308.5" y1="154" y2="176" gradientUnits="userSpaceOnUse"><stop stopColor="#6A1B9A" /><stop offset="1" stopColor="#D32F2F" /></linearGradient></defs></>),
  },
};