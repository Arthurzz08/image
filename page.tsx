'use client'
import { Template, ImageCard } from '../components';
import { useImageService  } from '../resource/service';
import { useState } from 'react';
import { Image } from '../resource/image';

export default function Galeria() {

    const useService = useImageService();

    const [images, setImages] = useState<Image[]>([]);

    async function searchImages() {
        const result = await useService.buscar();

        setImages(result);
        console.table(result);
    }

    /*renderizando a imagem na tela*/
  function renderImageCard(image: Image ) {
    return (
      <ImageCard imageName = {image.name} 
                 imageUrl={image.url}
                 imageSize = {image.size}
                 uploadDate={image.uploadDate} />
    )
  }

  function renderImageCards() {
    //return images.map((image) => renderImageCard(image));
    return images.map(renderImageCard);
  }


    return (
        <Template>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={searchImages}
            >
            </button>

            <section className="grid grid-cols-3 gap-4 p-4">
                {
            renderImageCards()
            }
            </section>
        </Template>
    );
}
