import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full rounded-xl
            px-4 py-3 text-sm
            focus:outline-none
            transition-all duration-300
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-400/50' : ''}
            ${className}
          `}
          style={{
            backgroundColor: '#141419',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#f0eef5',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(244,114,182,0.4)';
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(244,114,182,0.2)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full rounded-xl
          px-4 py-3 text-sm
          focus:outline-none
          transition-all duration-300 resize-none min-h-[120px]
          ${error ? 'border-red-400/50' : ''}
          ${className}
        `}
        style={{
          backgroundColor: '#141419',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#f0eef5',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(244,114,182,0.4)';
          e.currentTarget.style.boxShadow = '0 0 0 1px rgba(244,114,182,0.2)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
