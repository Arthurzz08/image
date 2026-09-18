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
        imageSize={`${image.size} MB`}
        uploadDate={image.uploadDate} />
    )
  }

  function renderImageCards() {
    //return images.map((image) => renderImageCard(image));
    return images.map(renderImageCard);
  }


  return (
    <Template>
      <section className="flex flex-col items-center justify-center my-5">
        <div className="flex space-x-4">
          <input type="text"
            onChange={event => setQuery(event.target.value)}
            className="border px-4 py-2 rounded-lg text-white-900" placeholder="Buscar imagens..." />
          <select onChange={event => setExtension(event.target.value)}
            className="border px-4 py-2 rounded-lg text-white-900">
            <option value="">All formats</option>
            <option value="PNG">PNG</option>
            <option value="JPG">JPG</option>
            <option value="JPEG">JPEG</option>
            <option value="GIF">GIF</option>
          </select>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={searchImages}>Search </button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Add New </button>
        </div>
      </section>
      <section className="grid grid-cols-3 gap-4 p-4">
        {
          renderImageCards()
        }
      </section>
    </Template>
  );





}