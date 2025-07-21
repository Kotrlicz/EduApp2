import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-card rounded-xl shadow-lg p-6 max-w-2xl w-full relative">
        <button
          className="absolute top-2 right-2 text-lg font-bold text-muted-foreground hover:text-foreground"
          onClick={onClose}
          aria-label="Zavřít"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 