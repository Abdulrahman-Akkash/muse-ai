import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'ai';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    icon,
    className = '',
    ...props 
}) => {
    const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-muse-900 text-white hover:bg-black focus:ring-muse-500 shadow-sm",
        secondary: "bg-white text-muse-800 border border-muse-200 hover:bg-muse-50 focus:ring-muse-300 shadow-sm",
        ghost: "bg-transparent text-muse-600 hover:bg-muse-100 hover:text-muse-900 focus:ring-muse-200",
        ai: "bg-accent text-white hover:bg-accent-hover focus:ring-accent shadow-md"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    return (
        <button 
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
};