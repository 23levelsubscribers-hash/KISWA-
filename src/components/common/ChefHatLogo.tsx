import React from 'react';

interface ChefHatLogoProps {
  className?: string;
  size?: number;
}

export const ChefHatLogo: React.FC<ChefHatLogoProps> = ({ className = '', size = 36 }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#ff6b00]"
      >
        {/* Chef Hat Outline */}
        <path
          d="M14 26C11.5 24.5 10 21.5 10 18C10 13.5 13.5 10 18 10C19.2 10 20.3 10.3 21.3 10.8C22.6 8.5 25.1 7 28 7C31.5 7 34.4 9.1 35.5 12.2C36.3 12.1 37.1 12 38 12C42.4 12 46 15.6 46 20C46 23.3 44 26.1 41.1 27.3"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Hat Bottom Band */}
        <path
          d="M13 28H41V35C41 36.1 40.1 37 39 37H15C13.9 37 13 36.1 13 35V28Z"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        {/* Pleat lines inside band */}
        <path
          d="M20 28V37M27 28V37M34 28V37"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Little chicken / flame emblem centered */}
        <path
          d="M27 18C27 16 28.5 14 30 14C30 16 32 17.5 32 19.5C32 21.5 30.2 23 28 23C26.5 23 25.5 22 25.5 21C25.5 19.5 27 19.5 27 18Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
