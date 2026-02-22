import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

// Menggunakan Named Export
export const Input = ({ label, ...props }: InputProps) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input 
      {...props}
      className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
    />
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

// Menggunakan Named Export
export const Textarea = ({ label, ...props }: TextareaProps) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <textarea 
      {...props}
      className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[100px]"
    />
  </div>
);