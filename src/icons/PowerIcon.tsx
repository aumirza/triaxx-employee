import React from 'react';

interface PowerIconProps {
  color?: 'white' | 'black';
  size?: number;
  className?: string;
}

const colorMap = {
  white: '#FFF',
  black: '#1E1E1E',
};

const PowerIcon: React.FC<PowerIconProps> = ({ color = 'black', size = 48, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 49 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M37.2202 13.28C39.737 15.7976 41.4508 19.0049 42.1448 22.4964C42.8389 25.9879 42.4821 29.6068 41.1195 32.8955C39.757 36.1842 37.4499 38.9951 34.4899 40.9727C31.5299 42.9503 28.0501 44.0058 24.4902 44.0058C20.9304 44.0058 17.4505 42.9503 14.4906 40.9727C11.5306 38.9951 9.22352 36.1842 7.86097 32.8955C6.49842 29.6068 6.14162 25.9879 6.83568 22.4964C7.52974 19.0049 9.24349 15.7976 11.7602 13.28M24.5002 4V24"
      stroke={colorMap[color]}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PowerIcon; 