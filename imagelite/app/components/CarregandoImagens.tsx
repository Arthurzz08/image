export default function CarregandoImagens({ quantidade = 8 }: { quantidade?: number }) {
  return (
    <div className="w-full" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3 py-10">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-900/40 border-t-red-600" />
        <p className="text-sm tracking-wide text-neutral-400">
          Carregando imagens da Nação...
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: quantidade }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-xl border border-white/10 bg-white/5"
          >
            <div className="h-44 w-full bg-white/10" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-3/4 rounded bg-white/10" />
              <div className="h-3 w-1/2 rounded bg-red-900/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}