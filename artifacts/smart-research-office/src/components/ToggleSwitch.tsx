import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
}

export function ToggleSwitch({ enabled, onChange, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && <p className="text-sm font-medium text-main">{label}</p>}
          {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none
          ${enabled ? 'bg-violet-600' : 'bg-slate-200'}
        `}
        aria-pressed={enabled}
      >
        <span
          className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
          style={{ transform: enabled ? 'translateX(-20px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );
}
