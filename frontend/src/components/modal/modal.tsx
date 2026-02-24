'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Cegah layar geser (Layout Shift)
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Untuk modal biasa, kita bisa biarkan dia langsung hilang atau beri sedikit delay
      setShouldRender(false);
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop - Menggunakan animasi fade-in yang sama dengan alert */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] animate-fade-in-modal"
        onClick={onClose}
      />
      
      {/* Modal Card - Menggunakan animasi swal-show yang identik */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col animate-modal-show border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-[#545454] text-xl font-bold tracking-tight">
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-[#595959]">
          {children}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInModal { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        @keyframes modalShow { 
          0% { transform: scale(0.5); opacity: 0; } 
          100% { transform: scale(1); opacity: 1; } 
        }

        .animate-fade-in-modal { 
          animation: fadeInModal 0.2s ease-out forwards; 
        }
        .animate-modal-show { 
          animation: modalShow 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
        }
      ` }} />
    </div>
  );
};

export default Modal;