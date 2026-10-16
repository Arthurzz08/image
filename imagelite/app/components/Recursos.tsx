const recursos = [
  { icone: '🦅', titulo: 'Upload rápido', texto: 'Envie suas imagens em PNG, JPEG ou GIF em poucos cliques.' },
  { icone: '🔥', titulo: 'Tags', texto: 'Organize tudo com tags e encontre o que precisa depois.' },
  { icone: '🎯', titulo: 'Busca certeira', texto: 'Pesquise por nome ou filtre por formato na hora.' },
  { icone: '🏆', titulo: 'Leve e veloz', texto: 'Front em Next.js e API em Spring Boot, sem peso extra.' },
];

export function Recursos() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <h2 className="mb-2 text-center text-3xl font-bold text-white">
        Tudo que você <span className="text-red-600">precisa</span>
      </h2>
      <p className="mb-10 text-center text-sm text-white/60">
        Recursos pensados pra deixar sua galeria simples e organizada.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recursos.map((r) => (
          <div
            key={r.titulo}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-red-600/60 hover:bg-red-600/10"
          >
            <div className="mb-3 text-3xl">{r.icone}</div>
            <h3 className="mb-1 font-semibold text-white">{r.titulo}</h3>
            <p className="text-sm text-white/60">{r.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}