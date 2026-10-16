'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface PrimeiroComponenteProps {
  mensagem?: string;
  mensagemBotao?: string;
}

const destaques = ['PNG · JPEG · GIF', 'Upload + Tags', 'Busca instantânea'];
const TEMPO_CARREGAMENTO = 1600; // ms

export const PrimeiroComponente = ({
  mensagem,
  mensagemBotao,
}: PrimeiroComponenteProps) => {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  // pré-carrega a galeria em segundo plano
  useEffect(() => {
    router.prefetch('/galeria');
  }, [router]);

  const irParaGaleria = (e: React.MouseEvent) => {
    e.preventDefault();
    if (carregando) return;
    setCarregando(true);
    setTimeout(() => router.push('/galeria'), TEMPO_CARREGAMENTO);
  };

  const verRecursos = (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById('recursos')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes barra { from { width: 0%; } to { width: 100%; } }
        .fade-up { opacity: 0; animation: fadeUp .8s ease forwards; }
        .fade-in { animation: fadeIn .3s ease forwards; }
        .barra { animation: barra ${TEMPO_CARREGAMENTO}ms ease-in-out forwards; }
      `}</style>

      {/* Glows de fundo em vermelho e preto */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-red-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-red-700/20 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Selo */}
        <span className="fade-up mb-6 rounded-full border border-red-600/50 bg-red-600/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-widest text-red-400">
          Galeria do Mengão · Next.js + Spring Boot
        </span>

        {/* Escudo com brilho pulsante */}
        <div className="fade-up relative mb-6" style={{ animationDelay: '.1s' }}>
          <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-red-600/40 blur-3xl" />
          <div className="drop-shadow-[0_8px_20px_rgba(220,38,38,0.35)]">
            <Image
              src="/flamengo.png"
              alt="Escudo do Flamengo"
              width={90}
              height={104}
              priority
            />
          </div>
        </div>

        <h1
          className="fade-up text-4xl font-bold tracking-tight sm:text-5xl"
          style={{ animationDelay: '.2s' }}
        >
          Image<span className="text-red-600">Lite</span>
        </h1>

        <span
          className="fade-up mt-2 text-xs font-semibold uppercase tracking-widest text-white/40"
          style={{ animationDelay: '.25s' }}
        >
          Uma vez Flamengo, sempre Flamengo
        </span>

        {mensagem && (
          <p
            className="fade-up mt-4 max-w-md text-white/60"
            style={{ animationDelay: '.35s' }}
          >
            {mensagem}
          </p>
        )}

        {/* Botões */}
        <div
          className="fade-up mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: '.45s' }}
        >
          <Link
            href="/galeria"
            onClick={irParaGaleria}
            className="rounded-xl bg-red-600 px-8 py-3 text-sm font-semibold shadow-lg shadow-red-600/30 transition hover:scale-105 hover:bg-red-700"
          >
            {mensagemBotao || 'Acessar Galeria'}
          </Link>
          <a
            href="#recursos"
            onClick={verRecursos}
            className="rounded-xl border border-white/20 px-8 py-3 text-sm font-semibold text-white/80 transition hover:border-red-600 hover:text-white"
          >
            Ver recursos
          </a>
        </div>

        {/* Mini-destaques */}
        <div
          className="fade-up mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: '.55s' }}
        >
          {destaques.map((d) => (
            <span
              key={d}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/60"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Seta de rolagem */}
      <a
        href="#recursos"
        onClick={verRecursos}
        aria-label="Rolar para baixo"
        className="absolute bottom-8 z-10 animate-bounce text-2xl text-white/40 transition hover:text-red-500"
      >
        ↓
      </a>

      {/* Tela de carregamento */}
      {carregando && (
        <div
          className="fade-in fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          role="status"
          aria-live="polite"
        >
          <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-red-600/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-red-700/20 blur-3xl" />

          <div className="relative flex h-36 w-36 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-red-600/20 border-t-red-600" />
            <div className="animate-pulse drop-shadow-[0_8px_20px_rgba(220,38,38,0.5)]">
              <Image src="/flamengo.png" alt="" width={64} height={74} />
            </div>
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-white/70">
            Carregando galeria...
          </p>

          <div className="mt-4 h-1 w-56 overflow-hidden rounded-full bg-white/10">
            <div className="barra h-full rounded-full bg-red-600 shadow-[0_0_12px_rgba(229,0,28,0.8)]" />
          </div>
        </div>
      )}
    </section>
  );
};