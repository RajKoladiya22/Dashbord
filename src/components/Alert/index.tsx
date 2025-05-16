// AutoDismissAlert.tsx
import React, { useEffect, useState } from 'react';
import { Alert } from 'antd';

export interface AutoDismissAlertProps {
  message: React.ReactNode;
  description?: React.ReactNode;
  type?: 'success' | 'info' | 'warning' | 'error';
  showIcon?: boolean;
  style?: React.CSSProperties;
  onClose?: () => void;
  /** Time in milliseconds before auto-close; default to 10000 (10s) */
  durationMs?: number;
}

const AutoDismissAlert: React.FC<AutoDismissAlertProps> = ({
  message,
  description,
  type = 'info',
  showIcon = false,
  style,
  onClose,
  durationMs = 10000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onClose]);

  if (!visible) return null;

  return (
    <Alert
      message={message}
      description={description}
      type={type}
      showIcon={showIcon}
      closable
      onClose={() => {
        setVisible(false);
        onClose?.();
      }}
      style={style}
    />
  );
};

export default AutoDismissAlert;
