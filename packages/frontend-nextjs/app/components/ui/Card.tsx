import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ 
  children, 
  className = '', 
  onClick, 
  padding = 'md',
  shadow = 'sm'
}: CardProps) {
  // Mapear padding para estilos
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  // Mapear shadow para estilos
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg'
  };

  return (
    <div 
      className={`
        bg-white 
        rounded-lg 
        border border-gray-100
        ${paddingStyles[padding]} 
        ${shadowStyles[shadow]} 
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Sub-componentes para uso com Card
Card.Header = function CardHeader({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={`border-b pb-3 mb-3 ${className}`}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <h3 className={`font-semibold text-lg ${className}`}>
      {children}
    </h3>
  );
};

Card.Body = function CardBody({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={`border-t pt-3 mt-3 ${className}`}>
      {children}
    </div>
  );
};
