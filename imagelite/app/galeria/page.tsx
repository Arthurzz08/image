'use client'
import { Template, ImageCard } from '../components';
import CarregandoImagens from '../components/CarregandoImagens';
import AddImageModal from '../components/AddImageModal';
import Lightbox from '../components/Lightbox';
import Toast, { Aviso } from '../components/Toast';
import { useImageService } from '../resource/service';
import { useEffect, useRef, useState } from 'react';
import { Heart, ImagePlus, Plus } from 'lucide-react';
import { Image } from '../resource/image';

export default function Galeria() {

  const useService = useImageService();
  const [images, setImages] = useState<Image[]>([]);
  const [query, setQuery] = useState<string>('')
  const [extension, setExtension] = useState<string>('')
  const [somenteFavoritas, setSomenteFavoritas] = useState<boolean>(false)
  const [carregando, setCarregando] = useState<boolean>(false)
  const [modalAberto, setModalAberto] = useState<boolean>(false)
  const [indiceLightbox, setIndiceLightbox] = useState<number | null>(null)
  const [aviso, setAviso] = useState<Aviso | null>(null)

  // evita que uma resposta antiga sobrescreva uma busca mais nova
  const requisicaoAtual = useRef(0);

  // lista exibida (o filtro de favoritas é feito aqui, sem nova chamada à API)
  const visiveis = somenteFavoritas ? images.filter(image => image.favorite) : images;

  async function searchImages() {
    const id = ++requisicaoAtual.current;
    setCarregando(true);
    try {
      const result = await useService.buscar(query, extension);
      if (id === requisicaoAtual.current) setImages(result);
    } catch {
      if (id === requisicaoAtual.current) {
        setAviso({ tipo: 'erro', mensagem: 'Não foi possível carregar as imagens.' });
      }
    } finally {
      if (id === requisicaoAtual.current) setCarregando(false);
    }
  }

  // carrega a galeria ao abrir e busca automaticamente (debounce de 300ms)
  useEffect(() => {
    const timer = setTimeout(searchImages, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, extension]);

  /*envia a nova imagem, fecha a janela e atualiza a galeria*/
  async function salvarImagem(file: File, name: string, tags: string) {
    await useService.salvar(file, name, tags);
    setModalAberto(false);
    setAviso({ tipo: 'sucesso', mensagem: 'Imagem adicionada com sucesso!' });
    await searchImages();
  }

  async function excluirImagem(id: string): Promise<boolean> {
    try {
      await useService.excluir(id);
      setImages(atual => atual.filter(image => image.id !== id));
      setAviso({ tipo: 'sucesso', mensagem: 'Imagem excluída com sucesso!' });
      return true;
    } catch {
      setAviso({ tipo: 'erro', mensagem: 'Erro ao excluir a imagem.' });
      return false;
    }
  }

  async function favoritarImagem(id: string) {
    try {
      const favorite = await useService.favoritar(id);
      setImages(atual => atual.map(image => image.id === id ? { ...image, favorite } : image));
      setAviso({
        tipo: 'sucesso',
        mensagem: favorite ? 'Adicionada aos favoritos!' : 'Removida dos favoritos.',
      });
    } catch {
      setAviso({ tipo: 'erro', mensagem: 'Erro ao atualizar o favorito.' });
    }
  }

  async function editarImagem(id: string, name: string, tags: string): Promise<boolean> {
    try {
      await useService.atualizar(id, name, tags);
      setImages(atual => atual.map(image => image.id === id ? { ...image, name, tags } : image));
      setAviso({ tipo: 'sucesso', mensagem: 'Imagem atualizada com sucesso!' });
      return true;
    } catch {
      setAviso({ tipo: 'erro', mensagem: 'Erro ao atualizar a imagem.' });
      return false;
    }
  }

  async function baixarImagem(image: Image) {
    try {
      await useService.baixar(image);
    } catch {
      setAviso({ tipo: 'erro', mensagem: 'Não foi possível baixar a imagem.' });
    }
  }

  /*renderizando a imagem na tela*/
  function renderImageCard(image: Image, indice: number) {
    return (
      <ImageCard key={image.id ?? image.url}
        image={image}
        onAbrir={() => setIndiceLightbox(indice)}
        onFavoritar={favoritarImagem}
        onEditar={editarImagem}
        onExcluir={excluirImagem}
        onTagClick={setQuery} />
    )
  }

  function renderImageCards() {
    return visiveis.map(renderImageCard);
  }

  const temFiltro = query.trim() !== '' || extension !== '';
  const semFavoritas = somenteFavoritas && images.length > 0;

  function renderEstadoVazio() {
    let titulo = 'Nenhuma imagem ainda';
    let mensagem = 'Comece a montar a galeria da Nação adicionando a primeira imagem.';

    if (semFavoritas) {
      titulo = 'Nenhuma favorita ainda';
      mensagem = 'Clique no coração de uma imagem para ela aparecer aqui.';
    } else if (temFiltro) {
      titulo = 'Nenhuma imagem encontrada';
      mensagem = 'Tente buscar por outro nome ou mude o formato.';
    }

    return (
      <section className="flex flex-col items-center px-4 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-red-600/30 bg-red-600/10 text-red-500">
          {semFavoritas ? <Heart size={36} /> : <ImagePlus size={36} />}
        </div>
        <h3 className="mt-4 text-xl font-bold">{titulo}</h3>
        <p className="mt-2 max-w-sm text-white/60">{mensagem}</p>
        {!temFiltro && !somenteFavoritas && (
          <button
            className="mt-6 h-11 rounded-lg bg-red-600 px-5 font-bold text-white shadow-[0_6px_24px_rgba(220,38,38,0.35)] transition hover:bg-red-700"
            onClick={() => setModalAberto(true)}>
            Adicionar imagem
          </button>
        )}
      </section>
    )
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
            value={query}
            onChange={event => setQuery(event.target.value)}
            className="h-11 w-72 rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/40 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30"
            placeholder="Buscar imagens..." />

          <select value={extension}
            onChange={event => setExtension(event.target.value)}
            className="h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-white focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30 [&>option]:bg-black">
            <option value="">Todos os formatos</option>
            <option value="PNG">PNG</option>
            <option value="JPG">JPG</option>
            <option value="JPEG">JPEG</option>
            <option value="GIF">GIF</option>
          </select>

          <button
            aria-pressed={somenteFavoritas}
            onClick={() => setSomenteFavoritas(atual => !atual)}
            className={`h-11 rounded-lg border px-5 font-bold transition ${
              somenteFavoritas
                ? 'border-red-600 bg-red-600 text-white'
                : 'border-white/10 bg-white/5 text-white hover:border-red-600'
            }`}>
            <span className="inline-flex items-center gap-2">
              <Heart size={16} className={somenteFavoritas ? 'fill-white' : ''} />
              Só favoritas
            </span>
          </button>

          <button
            className="h-11 rounded-lg border border-red-600 px-5 font-bold text-white transition hover:bg-red-600/15"
            onClick={() => setModalAberto(true)}>
            <span className="inline-flex items-center gap-2">
              <Plus size={18} />
              Adicionar
            </span>
          </button>
        </div>

        {!carregando && visiveis.length > 0 && (
          <p className="mt-4 text-sm text-white/40">
            {visiveis.length} {visiveis.length === 1 ? 'imagem' : 'imagens'}
          </p>
        )}
      </section>

      {carregando ? (
        <CarregandoImagens />
      ) : visiveis.length === 0 ? (
        renderEstadoVazio()
      ) : (
        <section className="container mx-auto grid grid-cols-1 gap-6 px-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          {renderImageCards()}
        </section>
      )}

      <AddImageModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={salvarImagem} />

      {indiceLightbox !== null && visiveis[indiceLightbox] && (
        <Lightbox
          images={visiveis}
          indice={indiceLightbox}
          onFechar={() => setIndiceLightbox(null)}
          onMudar={setIndiceLightbox}
          onBaixar={baixarImagem} />
      )}

      <Toast aviso={aviso} onFechar={() => setAviso(null)} />
    </Template>
  );
}