import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  size = 'md',
  fullWidth = false,
  type = 'button',
  icon,
}: PrimaryButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        primary-gradient text-white
        transition-all duration-200 cursor-pointer
        hover:opacity-90 hover:shadow-lg hover:shadow-violet-200
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
