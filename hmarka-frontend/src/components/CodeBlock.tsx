'use client';

import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group mt-6 mb-8 rounded-sm overflow-hidden code-block">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-b border-border-color">
        <span className="font-mono text-xs text-text-muted">{language || 'code'}</span>
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-1 px-2 py-1 bg-surface border rounded-sm font-mono text-xs transition-all ${
            copied 
              ? 'text-success border-success opacity-100' 
              : 'text-text-muted border-border-color hover:text-text-main hover:border-primary opacity-0 group-hover:opacity-100 focus:opacity-100'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'Скопійовано' : 'Копіювати'}
        </button>
      </div>

      {/* Code */}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-[14px] leading-relaxed m-0 text-gray-300">
          <code className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
