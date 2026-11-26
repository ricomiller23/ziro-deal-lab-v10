import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/60 py-6 px-4 sm:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
            Z
          </div>
          <div>
            <span className="font-semibold text-slate-200">ZIRO Deal Lab</span>
            <span className="text-slate-400 ml-2">| Financial Model & Interactive Investor Stress Test</span>
          </div>
        </div>

        <div className="text-center md:text-right text-[11px] text-slate-400 max-w-xl">
          <p>
            <strong className="text-amber-400 font-medium">Compliance & Regulatory Notice:</strong> ZIRO Health offers at-home diagnostic blood tests and nutritional insights. Oral peptide formulations referenced in pro-forma materials are investigational and provided as an uncommitted upside memo only. No therapeutic, curative, or preventative medical claims are made. Not approved as medicines.
          </p>
        </div>
      </div>
    </footer>
  );
};
