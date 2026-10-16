'use client'
import { useEffect, useRef } from 'react';

export type TipoAviso = 'sucesso' | 'erro';

export interface Aviso {
  tipo: TipoAviso;
  mensagem: string;
}

interface ToastProps {
  aviso: Aviso | null;
  onFechar: () => void;
}

export default function Toast({ aviso, onFechar }: ToastProps) {
  // guarda a versão mais recente da função, para o timer não reiniciar a cada render
  const fecharRef = useRef(onFechar);
  fecharRef.current = onFechar;

  useEffect(() => {
    if (!aviso) return;
    const timer = setTimeout(() => fecharRef.current(), 4000);
    return () => clearTimeout(timer);
  }, [aviso]);

  if (!aviso) return null;

  const sucesso = aviso.tipo === 'sucesso';

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-[60] flex max-w-sm items-center gap-3 rounded-xl border bg-neutral-950 px-5 py-4 text-sm font-medium text-white shadow-2xl ${
        sucesso
          ? 'border-green-600/60 shadow-[0_0_30px_rgba(22,163,74,0.25)]'
          : 'border-red-600/60 shadow-[0_0_30px_rgba(220,38,38,0.3)]'
      }`}
    >
      <span className={sucesso ? 'text-green-500' : 'text-red-500'}>
        {sucesso ? '✔' : '✖'}
      </span>
      <span className="flex-1">{aviso.mensagem}</span>
      <button
        onClick={onFechar}
        aria-label="Fechar aviso"
        className="text-white/50 transition hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}