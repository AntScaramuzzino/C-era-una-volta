import React from 'react';
import { X, Sparkles, Loader2, Download, FileText } from 'lucide-react';
import Markdown from 'react-markdown';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface AiAssistantModalProps {
  open: boolean;
  loading: boolean;
  content: string | null;
  title: string;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ open, loading, content, title, onClose }) => {
  if (!open) return null;

  const downloadMarkdown = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = `Storia_Cyberbullismo.md`; 
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const element = document.getElementById('story-content-to-print');
    if (!element) return;
    const opt = {
      margin:       15,
      filename:     'Storia_Cyberbullismo.pdf',
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm no-print">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-6 flex justify-between items-center text-white" style={{ background: 'linear-gradient(to right, #4f46e5, #9333ea)' }}>
          <h2 className="font-bold flex items-center gap-2 uppercase tracking-tighter whitespace-nowrap">
            <Sparkles size={20}/> {title}
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={20}/>
          </button>
        </div>
        <div className="p-8 md:p-12 max-h-[70vh] overflow-y-auto bg-slate-50/30">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 className="animate-spin text-indigo-500"/>
              <p className="animate-pulse font-black text-slate-500 uppercase">L'IA sta elaborando...</p>
            </div>
          ) : (
            <div className="story-render text-slate-800 text-left">
              <div id="story-content-to-print" className="markdown-body prose prose-indigo max-w-none">
                <Markdown>{content || ''}</Markdown>
              </div>
              <div className="mt-12 pt-8 border-t flex flex-wrap justify-center gap-3">
                <button 
                  onClick={downloadPDF} 
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs hover:bg-red-700 transition shadow-xl active:scale-95"
                  title="Scarica la storia in formato PDF"
                >
                  <FileText size={18}/> Scarica PDF
                </button>
                <button 
                  onClick={downloadMarkdown} 
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs hover:bg-indigo-700 transition shadow-xl active:scale-95"
                  title="Scarica la storia in formato testo (Markdown)"
                >
                  <Download size={18}/> Scarica .md
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
