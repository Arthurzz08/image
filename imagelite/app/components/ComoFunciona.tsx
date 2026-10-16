const passos = [
  { n: '1', titulo: 'Envie', texto: 'Clique em "Add New" e escolha a imagem.' },
  { n: '2', titulo: 'Organize', texto: 'Dê um nome e adicione tags.' },
  { n: '3', titulo: 'Encontre', texto: 'Busque por nome ou formato na galeria.' },
];

export function ComoFunciona() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 pb-20">
      <h2 className="mb-10 text-center text-3xl font-bold text-white">
        Como <span className="text-red-600">funciona</span>
      </h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {passos.map((p) => (
          <div key={p.n} className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white shadow-[0_0_20px_rgba(229,0,28,0.5)]">
              {p.n}
            </div>
            <h3 className="font-semibold text-white">{p.titulo}</h3>
            <p className="text-sm text-white/60">{p.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}