
import { TrendingUp } from 'lucide-react';

interface LogoProps {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ variant = 'default', size = 'md' }: LogoProps) => {
  const textColor = variant === 'white' ? 'text-white' : 'text-foreground';
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };
  
  const iconSize = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  return (
    <div className={`flex items-center gap-2 font-bold ${sizeClasses[size]}`}>
      <TrendingUp className="text-primary" size={iconSize[size]} />
      <span className={`${textColor} tracking-tight`}>
        Trend<span className="text-primary">Odds</span>
      </span>
    </div>
  );
};

export default Logo;
