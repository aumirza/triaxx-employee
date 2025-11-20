import React from "react";

const Skeleton: React.FC<{
  width?: string;
  height?: string;
  className?: string;
  rounded?: string;
}> = ({
  width = "w-full",
  height = "h-4",
  className = "",
  rounded = "rounded",
}) => {
  return (
    <div
      className={`bg-gray-200/70 ${width} ${height} ${rounded} animate-pulse ${className}`}
    />
  );
};

export default Skeleton;
