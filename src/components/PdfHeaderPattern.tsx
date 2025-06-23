import React from 'react';

export const PdfHeaderPattern = () => {
  return (
    <div style={{ width: '800px', height: '150px' }} className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 border-2 border-white rotate-45 transform -translate-x-16 -translate-y-16"></div>
        <div className="absolute top-0 right-0 w-24 h-24 border-2 border-white rotate-45 transform translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-1/3 w-20 h-20 border-2 border-white rotate-45 transform translate-y-10"></div>
      </div>
    </div>
  );
};
