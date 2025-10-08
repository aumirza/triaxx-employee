const TimerIcon = ({
  width = 24,
  height = 25,
//   fill = "#C51800",
  className='',
  ...rest
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...rest}
  >
    <path
 d="M12.5 6.5V12.5L16.5 14.5M22.5 12.5C22.5 18.0228 18.0228 22.5 12.5 22.5C6.97715 22.5 2.5 18.0228 2.5 12.5C2.5 6.97715 6.97715 2.5 12.5 2.5C18.0228 2.5 22.5 6.97715 22.5 12.5Z"
    //    fill={fill}
       stroke="#C51800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    />
  </svg>
);
export default TimerIcon;
