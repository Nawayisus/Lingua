'use client';

import React, { useState, useRef, DragEvent, KeyboardEvent } from 'react';

export default function FileDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      console.log('Files dropped:', files);
      // Handle file processing here
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Upload file area"
      aria-describedby="dropzone-desc"
    >
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => console.log(e.target.files)}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="space-y-2 pointer-events-none">
        <div className="flex justify-center text-gray-500">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-900">
          Drop files here to translate
        </p>
        <p id="dropzone-desc" className="text-sm text-gray-500">
          or click to select from your computer
        </p>
      </div>
    </div>
  );
}
