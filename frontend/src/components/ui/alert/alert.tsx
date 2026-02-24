'use client';

import React from 'react';
import { Check, AlertTriangle, X, Info } from 'lucide-react';
import Button from '../button/button';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: AlertType;
  confirmLabel?: string;
}

const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'success',
  confirmLabel = 'OK',
}: AlertModalProps) => {
  if (!isOpen) return null;

  const config: Record<AlertType, { 
    icon: React.ReactNode; 
    color: string; 
    borderColor: string;
    iconBg: string;
  }> = {
    success: {
      icon: <Check size={48} strokeWidth={2.5} />,
      color: 'text-green-500',
      borderColor: 'border-green-500',
      iconBg: 'bg-green-50',
    },
    error: {
      icon: <X size={48} strokeWidth={2.5} />,
      color: 'text-red-500',
      borderColor: 'border-red-500',
      iconBg: 'bg-red-50',
    },
    warning: {
      icon: <AlertTriangle size={48} strokeWidth={2.5} />,
      color: 'text-amber-500',
      borderColor: 'border-amber-500',
      iconBg: 'bg-amber-50',
    },
    info: {
      icon: <Info size={48} strokeWidth={2.5} />,
      color: 'text-blue-500',
      borderColor: 'border-blue-500',
      iconBg: 'bg-blue-50',
    },
  };

  const current = config[type];
  const isDanger = type === 'warning' || type === 'error';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-[460px] p-10 flex flex-col items-center animate-swal-show border border-gray-100">
        
        {/* Icon */}
        <div className={`w-24 h-24 rounded-full border-[3px] flex items-center justify-center mb-6 ${current.color} ${current.borderColor} ${current.iconBg} animate-icon-pop`}>
          {current.icon}
        </div>
        
        {/* Text */}
        <h2 className="text-[#545454] text-[27px] font-normal mb-3 text-center tracking-tight">
          {title}
        </h2>
        <div className="text-[#595959] text-[18px] font-light mb-10 text-center leading-relaxed px-4">
          {message}
        </div>
        
        {/* Buttons Group */}
        <div className="flex flex-row-reverse gap-3 w-full justify-center">
          {/* Tombol Konfirmasi */}
          <Button 
            variant={isDanger ? 'danger' : 'royal'}
            size="md"
            onClick={() => {
              if (onConfirm) onConfirm();
              else onClose();
            }} 
            className={`swal-btn-confirm min-w-[120px]`}
            style={{ 
                backgroundColor: isDanger ? '#ef4444' : '#3159b3', 
                color: 'white' 
            }}
          >
            {confirmLabel}
          </Button>

          {/* Tombol Batal */}
          {onConfirm && (
            <Button 
              variant="secondary"
              size="md"
              onClick={onClose} 
              className="swal-btn-cancel min-w-[120px]"
              style={{ backgroundColor: '#334155', color: 'white' }}
            >
              Batal
            </Button>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes swalShow { 
          0% { transform: scale(0.5); opacity: 0; } 
          100% { transform: scale(1); opacity: 1; } 
        }
        @keyframes iconPop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .animate-swal-show { animation: swalShow 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-icon-pop { animation: iconPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

        /* RESET SEMUA BUTTON */
        .swal-btn-confirm, .swal-btn-cancel {
          transition: none !important;
          transform: none !important;
          box-shadow: none !important;
          cursor: pointer !important;
        }

        /* FIX HOVER PUTIH - KITA PAKSA WARNA HEX DI SINI */
        .swal-btn-confirm:hover {
          background-color: ${isDanger ? '#ef4444' : '#3159b3'} !important;
          color: white !important;
          opacity: 1 !important;
        }

        .swal-btn-cancel:hover {
          background-color: #334155 !important;
          color: white !important;
          opacity: 1 !important;
        }

        /* MATIKAN EFEK CLICK/ACTIVE */
        .swal-btn-confirm:active, .swal-btn-cancel:active {
          transform: none !important;
        }
      ` }} />
    </div>
  );
};

export default AlertModal;