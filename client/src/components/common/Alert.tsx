import { ReactNode } from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; text: string; icon: string }> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-400',
    text: 'text-blue-800 dark:text-blue-300',
    icon: 'text-blue-400'
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-400',
    text: 'text-green-800 dark:text-green-300',
    icon: 'text-green-400'
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-400',
    text: 'text-yellow-800 dark:text-yellow-300',
    icon: 'text-yellow-400'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-400',
    text: 'text-red-800 dark:text-red-300',
    icon: 'text-red-400'
  }
};

export const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = ''
}: AlertProps): JSX.Element => {
  const styles = variantStyles[variant];

  return (
    <div
      className={`${styles.bg} ${styles.border} border-l-4 p-4 rounded-r-lg ${className}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-1">
          {title && (
            <p className={`font-medium ${styles.text}`}>{title}</p>
          )}
          <p className={`text-sm ${styles.text}`}>{children}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${styles.icon} hover:opacity-75`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
