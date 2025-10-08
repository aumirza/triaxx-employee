
const CheckmarkIcon = ({ className = '', width = 26, height = 27, stroke = '#34C759', ...rest }) => (
  <svg width={width} height={height} viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...rest}>
    <circle cx="13" cy="13.5" r="12" stroke={stroke} strokeWidth="2" />
    <path d="M8 13.6111L11.4444 17.7222L17.5556 8.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default CheckmarkIcon; 