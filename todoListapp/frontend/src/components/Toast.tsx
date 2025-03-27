import React, { useEffect, useState } from 'react';
import { Toast as BootstrapToast } from 'react-bootstrap';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  autoHide?: boolean;
  delay?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  autoHide = true,
  delay = 3000,
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
  }, [message]);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const getVariant = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1050 }}
    >
      <BootstrapToast
        show={show}
        onClose={handleClose}
        delay={autoHide ? delay : undefined}
        autohide={autoHide}
        className="animate__animated animate__fadeInUp"
      >
        <BootstrapToast.Header className={`bg-${getVariant()} text-white`}>
          <strong className="me-auto">
            <span className="me-2">{getIcon()}</span>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={handleClose}
          />
        </BootstrapToast.Header>
        <BootstrapToast.Body>{message}</BootstrapToast.Body>
      </BootstrapToast>
    </div>
  );
};

export default Toast;
