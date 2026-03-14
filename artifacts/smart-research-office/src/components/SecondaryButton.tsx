import React from 'react';

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
}

export function SecondaryButton({
  children,
  onClick,
  disabled = false,
  size = 'md',
  fullWidth = false,
  type = 'button',
  icon,
  variant = 'default',
}: SecondaryButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const variantClasses = {
    default: 'bg-white border border-violet-200 text-[#6D28D9] hover:bg-violet-50 hover:border-violet-300',
    danger: 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        transition-all duration-200 cursor-pointer
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
