'use client';

import Link from 'next/link';
import Image from 'next/image';

interface PrimeiroComponenteProps {
  mensagem?: string;
  mensagemBotao?: string;
}

export const PrimeiroComponente = ({
  mensagem,
  mensagemBotao,
}: PrimeiroComponenteProps) => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
      {/* Glows de fundo em vermelho e preto */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-red-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-red-700/20 blur-3xl" />

      <section className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Escudo do Flamengo (arquivo em /public/flamengo.png) */}
        <div className="mb-6 drop-shadow-[0_8px_20px_rgba(220,38,38,0.35)]">
          <Image
            src="/flamengo.png"
            alt="Escudo do Flamengo"
            width={90}
            height={104}
            priority
          />
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Image<span className="text-red-600">Lite</span>
        </h1>

        <span className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/40">
          Uma vez Flamengo, sempre Flamengo
        </span>

        {mensagem && (
          <p className="mt-4 max-w-md text-white/60">{mensagem}</p>
        )}

        <Link
          href="/galeria"
          className="mt-8 rounded-xl bg-red-600 px-8 py-3 text-sm font-semibold shadow-lg shadow-red-600/30 transition hover:scale-105 hover:bg-red-700"
        >
          {mensagemBotao || 'Acessar Galeria'}
        </Link>
      </section>
    </main>
  );
};
