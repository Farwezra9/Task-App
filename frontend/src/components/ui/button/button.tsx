import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Kita tambahkan variant 'royal' untuk warna khusus Dribbble kita
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'royal';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  ...props 
}: ButtonProps) => {
  // 1. Ubah font-semibold menjadi font-light atau font-normal agar sesuai request
  const baseStyles = "inline-flex items-center justify-center font-normal tracking-wide transition-all duration-200 rounded-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    // 2. Tambahkan warna #3159b3 di sini
    royal: "bg-[#3159b3] text-white shadow-xl shadow-blue-100 hover:bg-[#284a96]",
    primary: "bg-indigo-600 text-white shadow-sm",
    secondary: "bg-slate-100 text-slate-900",
    danger: "bg-red-500 text-white shadow-lg shadow-red-200 hover:bg-red-600",
    outline: "border border-slate-200 text-slate-600 hover:border-[#3159b3] hover:text-[#3159b3]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3", // Sedikit lebih tinggi agar terlihat premium
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          {/* Kamu bisa menambahkan spinner di sini */}
          <span className="opacity-70 font-light">Processing...</span>
        </div>
      ) : children}
    </button>
  );
};

export default Button;