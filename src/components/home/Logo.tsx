
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const Logo = ({ variant = 'default', size = 'md', animate = false }: LogoProps) => {
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

  if (animate) {
    return (
      <div className={`flex items-center gap-1.5 font-bold ${sizeClasses[size]}`}>
        <motion.div 
          className="relative"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
        >
          <TrendingUp className="text-primary" size={iconSize[size]} />
        </motion.div>
        <motion.span 
          className={`${textColor} tracking-tight`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Trend<motion.span 
            className="text-primary"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Odds
          </motion.span>
        </motion.span>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center gap-1.5 font-bold ${sizeClasses[size]}`}>
      <div className="relative">
        <TrendingUp className="text-primary" size={iconSize[size]} />
      </div>
      <span className={`${textColor} tracking-tight`}>
        Trend<span className="text-primary">Odds</span>
      </span>
    </div>
  );
};

export default Logo;
