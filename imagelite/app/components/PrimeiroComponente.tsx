'use client';

import Link from 'next/link';

interface PrimeiroComponenteProps {
  mensagem?: string;
  mensagemBotao?: string;
}

export const PrimeiroComponente = ({
  mensagem,
  mensagemBotao,
}: PrimeiroComponenteProps) => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 text-white">
      {/* Blobs de fundo */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <section className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-xl font-bold">
          IL
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Image<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Lite</span>
        </h1>

        {mensagem && (
          <p className="mt-4 max-w-md text-white/60">{mensagem}</p>
        )}

        <Link
          href="/galeria"
          className="mt-8 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-3 text-sm font-semibold shadow-lg shadow-purple-500/20 transition hover:scale-105"
        >
          {mensagemBotao || 'Acessar Galeria'}
        </Link>
      </section>
    </main>
  );
};
