import { AlertTriangle, HelpCircle, Info, Trash2, X } from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { useLang } from '@/app/LangContext';

const ConfirmContext = createContext(null);

const TONES = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-rose-100 text-rose-600',
    btn: 'bg-rose-600 text-white hover:bg-rose-700',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100 text-amber-600',
    btn: 'bg-amber-500 text-white hover:bg-amber-600',
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-100 text-blue-700',
    btn: 'bg-[#102D71] text-white hover:bg-[#1E40AF]',
  },
  primary: {
    icon: HelpCircle,
    iconBg: 'bg-brand-100 text-brand-700',
    btn: 'bg-brand-700 text-white hover:bg-brand-800',
  },
};

export function ConfirmProvider({ children }) {
  const { tr } = useLang();
  const [state, setState] = useState(null);
  const resolverRef = useRef(null);
  const titleId = useId();

  const close = useCallback((result) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setState(null);
    resolve?.(result);
  }, []);

  const confirm = useCallback((options) => {
    const cfg = typeof options === 'string' ? { message: options } : options || {};
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setState({
        title: cfg.title || tr('បញ្ជាក់សកម្មភាព', 'Confirm action'),
        message: cfg.message || '',
        confirmLabel: cfg.confirmLabel || tr('បញ្ជាក់', 'Confirm'),
        cancelLabel: cfg.cancelLabel || tr('បោះបង់', 'Cancel'),
        tone: cfg.tone || 'danger',
      });
    });
  }, [tr]);

  useEffect(() => {
    if (!state) return undefined;
    const onKey = (e) => e.key === 'Escape' && close(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state, close]);

  const tone = TONES[state?.tone] || TONES.danger;
  const Icon = tone.icon;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div className="no-print fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px] motion-safe:animate-fade-in"
            onClick={() => close(false)}
            aria-hidden="true"
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80 motion-safe:animate-pop-in"
          >
            <button
              type="button"
              onClick={() => close(false)}
              className="btn-icon absolute top-3 right-3 text-slate-400 hover:text-slate-600"
              aria-label={tr('បិទ', 'Close')}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center p-6 pb-5 sm:flex-row sm:items-start sm:gap-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tone.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-3 flex flex-col items-center text-center sm:mt-0 sm:items-start sm:pr-6 sm:text-left">
                <h3 id={titleId} className="text-lg font-semibold text-slate-900">
                  {state.title}
                </h3>
                {state.message && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{state.message}</p>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50 px-5 py-3.5">
              <button type="button" className="btn-secondary" onClick={() => close(false)}>
                {state.cancelLabel}
              </button>
              <button type="button" className={`btn ${tone.btn}`} onClick={() => close(true)} autoFocus>
                {state.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
