import React from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const typeClasses: Record<AlertType, string> = {
    success: 'bg-green-900/30 border-green-700 text-green-100',
    error: 'bg-red-900/30 border-red-700 text-red-100',
    warning: 'bg-yellow-900/30 border-yellow-700 text-yellow-100',
    info: 'bg-blue-900/30 border-blue-700 text-blue-100',
  };

  const icons: Record<AlertType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`border rounded-lg p-4 flex justify-between items-start gap-4 ${typeClasses[type]}`}>
      <div className="flex gap-3 flex-1">
        <span className="text-lg font-semibold flex-shrink-0">{icons[type]}</span>
        <div>
          {title && <h4 className="font-semibold">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-lg font-semibold hover:opacity-75 transition flex-shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  );
};
