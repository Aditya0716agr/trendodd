
import { SVGProps } from 'react';

const ArrowTrendingUp = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="animate-pulse"
      {...props}
    >
      <path d="M22 7L13.5 15.5L8.5 10.5L2 17"></path>
      <path d="M16 7H22V13"></path>
    </svg>
  );
};

export default ArrowTrendingUp;
