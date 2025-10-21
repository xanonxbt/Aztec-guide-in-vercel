
import React, { useState, useMemo } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import { RAW_GUIDES_TEXT } from './constants';
import { parseGuides } from './utils/guideParser';
import type { Guide } from './types';
import { CodeBlock } from './components/CodeBlock';
import { SunIcon, MoonIcon, RpcIcon, AztecIcon } from './components/Icons';

const App: React.FC = () => {
  const [theme, toggleTheme] = useDarkMode();
  const [currentPage, setCurrentPage] = useState<'rpc' | 'aztec'>('rpc');

  const guides = useMemo(() => parseGuides(RAW_GUIDES_TEXT), []);
  const activeGuide = guides[currentPage];

  const renderContentBlock = (block: any, index: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.content }} />
        );
      case 'code':
        return <CodeBlock key={index} language={block.language} code={block.content} />;
      case 'list':
        return (
          <ul key={index} className="list-disc list-inside mb-4 space-y-2 text-slate-600 dark:text-slate-300">
            {block.items.map((item: string, i: number) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        );
      case 'blockquote':
         return (
          <blockquote key={index} className="border-l-4 border-primary-500 pl-4 my-4 italic text-slate-500 dark:text-slate-400">
            <p dangerouslySetInnerHTML={{ __html: block.content }} />
          </blockquote>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">Node Setup Guides</h1>
            <button
              onClick={() => toggleTheme()}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="lg:flex lg:space-x-8">
          <aside className="lg:w-1/4 xl:w-1/5 mb-8 lg:mb-0 lg:sticky lg:top-24 self-start">
            <nav className="space-y-2">
              <button
                onClick={() => setCurrentPage('rpc')}
                className={`w-full text-left flex items-center p-3 rounded-lg font-medium transition-colors ${
                  currentPage === 'rpc'
                    ? 'bg-primary-500 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <RpcIcon className="mr-3"/>
                RPC Setup Guide
              </button>
              <button
                onClick={() => setCurrentPage('aztec')}
                className={`w-full text-left flex items-center p-3 rounded-lg font-medium transition-colors ${
                  currentPage === 'aztec'
                    ? 'bg-primary-500 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <AztecIcon className="mr-3" />
                Aztec Node Guide
              </button>
            </nav>
          </aside>
          
          <main className="lg:w-3/4 xl:w-4/5">
            <article className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm p-6 sm:p-8 lg:p-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2" dangerouslySetInnerHTML={{ __html: activeGuide.title }} />
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8" dangerouslySetInnerHTML={{ __html: activeGuide.description }} />
              
              <div className="space-y-12">
                {activeGuide.sections.map((section, i) => (
                  <section key={i} className="border-t border-slate-200 dark:border-slate-700 pt-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6" dangerouslySetInnerHTML={{ __html: section.title }} />
                    {section.blocks.map(renderContentBlock)}
                  </section>
                ))}
              </div>
            </article>
          </main>
        </div>
      </div>
       <footer className="text-center py-8 mt-8 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
        <p>Built by a world-class senior frontend React engineer.</p>
      </footer>
    </div>
  );
};

export default App;
