'use client'
import { Template, ImageCard } from '../components';
import { useImageService } from '../resource/service';
import { useState } from 'react';
import { Image } from '../resource/image';

export default function Galeria() {

  const useService = useImageService();
  const [images, setImages] = useState<Image[]>([]);
  const [query, setQuery] = useState<string>('')
  const [extension, setExtension] = useState<string>('')

  async function searchImages() {
    const result = await useService.buscar(query, extension);

    setImages(result);
    console.table(result);
  }

  /*renderizando a imagem na tela*/
  function renderImageCard(image: Image) {
    return (
      <ImageCard key={image.url}
        imageName={image.name}
        imageUrl={image.url}
        imageSize={`${image.size}`}
        uploadDate={image.uploadDate}
        extension={image.extension} />
    )
  }

  function renderImageCards() {
    return images.map(renderImageCard);
  }

  return (
    <Template>
      <section className="mt-12 flex flex-col items-center px-4 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Raça, amor e paixão
        </h2>
        <div className="mt-4 h-1 w-16 rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]" />
        <p className="mt-4 text-white/60">
          Guarde aqui as imagens da Nação Rubro-Negra.
        </p>
      </section>

      <section className="my-8 flex flex-col items-center justify-center px-4">
        <div className="flex flex-wrap justify-center gap-3">
          <input type="text"
            onChange={event => setQuery(event.target.value)}
            className="h-11 w-72 rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/40 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30"
            placeholder="Buscar imagens..." />

          <select onChange={event => setExtension(event.target.value)}
            className="h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30 [&>option]:bg-black">
            <option value="">All formats</option>
            <option value="PNG">PNG</option>
            <option value="JPG">JPG</option>
            <option value="JPEG">JPEG</option>
            <option value="GIF">GIF</option>
          </select>

          <button
            className="h-11 rounded-lg bg-red-600 px-5 font-bold text-white shadow-[0_6px_24px_rgba(220,38,38,0.35)] transition hover:bg-red-700"
            onClick={searchImages}>
            Search
          </button>

          <button
            className="h-11 rounded-lg border border-red-600 px-5 font-bold text-white transition hover:bg-red-600/15">
            Add New
          </button>
        </div>
      </section>

      <section className="container mx-auto grid grid-cols-1 gap-6 px-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {renderImageCards()}
      </section>
    </Template>
  );
}