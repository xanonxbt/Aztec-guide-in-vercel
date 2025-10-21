
import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface CodeBlockProps {
  language: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative my-6 rounded-xl overflow-hidden bg-slate-800 dark:bg-slate-900 shadow-lg">
      <div className="flex items-center justify-between text-xs px-4 py-2 bg-slate-700/50 dark:bg-black/20">
        <span className="text-slate-400 font-medium uppercase">{language || 'shell'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
          aria-label="Copy code to clipboard"
        >
          {isCopied ? (
            <>
              <CheckIcon />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="text-white font-mono">{code}</code>
      </pre>
    </div>
  );
};
