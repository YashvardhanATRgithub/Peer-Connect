import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primaryDark focus:ring-primary',
        secondary: 'bg-white text-primary border border-primary hover:bg-primary/10 focus:ring-primary/40',
        outline: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:ring-slate-300',
        ghost: 'bg-transparent text-white hover:bg-white/10 focus:ring-white/40',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
