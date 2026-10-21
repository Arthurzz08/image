'use client'
import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react';
import { Image } from '../resource/image';

interface LightboxProps {
  images: Image[];
  indice: number;
  onFechar: () => void;
  onMudar: (indice: number) => void;
  onBaixar: (image: Image) => void;
}

export default function Lightbox({ images, indice, onFechar, onMudar, onBaixar }: LightboxProps) {
  const total = images.length;
  const image = images[indice];

  function anterior() {
    onMudar((indice - 1 + total) % total);
  }

  function proxima() {
    onMudar((indice + 1) % total);
  }

  // teclado: ESC fecha, setas navegam. Também trava a rolagem da página ao fundo.
  useEffect(() => {
    if (!image) return;

    function aoPressionar(event: KeyboardEvent) {
      if (event.key === 'Escape') onFechar();
      else if (event.key === 'ArrowLeft' && total > 1) anterior();
      else if (event.key === 'ArrowRight' && total > 1) proxima();
    }

    window.addEventListener('keydown', aoPressionar);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', aoPressionar);
      document.body.style.overflow = overflowAnterior;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indice, total]);

  if (!image) return null;

  const tags = image.tags?.split(',').map(tag => tag.trim()).filter(Boolean) ?? [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.name}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 px-4 backdrop-blur-sm"
      onClick={onFechar}
    >
      {/* barra superior */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-4"
        onClick={event => event.stopPropagation()}
      >
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-white">{image.name}</p>
          <p className="text-sm text-white/50">{indice + 1} / {total}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onBaixar(image)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700"
          >
            <Download size={16} />
            Baixar
          </button>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* setas */}
      {total > 1 && (
        <>
          <button
            onClick={event => { event.stopPropagation(); anterior(); }}
            aria-label="Imagem anterior"
            className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-600"
          >
            <ChevronLeft size={26} />
          </button>
          <button
            onClick={event => { event.stopPropagation(); proxima(); }}
            aria-label="Próxima imagem"
            className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-600"
          >
            <ChevronRight size={26} />
          </button>
        </>
      )}

      {/* imagem */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={image.id}
        src={image.url}
        alt={image.name ?? 'Imagem'}
        onClick={event => event.stopPropagation()}
        className="max-h-[78vh] max-w-[90vw] rounded-lg object-contain shadow-[0_0_60px_rgba(220,38,38,0.2)]"
      />

      {tags.length > 0 && (
        <div
          className="absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-2 p-4"
          onClick={event => event.stopPropagation()}
        >
          {tags.map(tag => (
            <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}