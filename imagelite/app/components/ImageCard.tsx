'use client'
import { useEffect, useState } from 'react'
import { Heart, Pencil, Trash2 } from 'lucide-react'
import { Image } from '../resource/image'

interface ImageCardProps {
  image: Image;
  onAbrir: () => void;
  onFavoritar: (id: string) => void;
  onEditar: (id: string, name: string, tags: string) => Promise<boolean>;
  onExcluir: (id: string) => Promise<boolean>;
  onTagClick?: (tag: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image, onAbrir, onFavoritar, onEditar, onExcluir, onTagClick,
}) => {
  const { id, name, url, size, uploadDate, extension, tags, favorite } = image

  const [editando, setEditando] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const [editName, setEditName] = useState('')
  const [editTags, setEditTags] = useState('')
  const [carregando, setCarregando] = useState(false)

  const listaTags = tags?.split(',').map(tag => tag.trim()).filter(Boolean) ?? []

  // ESC fecha os modais do card
  useEffect(() => {
    if (!editando && !confirmando) return
    function aoPressionar(event: KeyboardEvent) {
      if (event.key === 'Escape' && !carregando) {
        setEditando(false)
        setConfirmando(false)
      }
    }
    window.addEventListener('keydown', aoPressionar)
    return () => window.removeEventListener('keydown', aoPressionar)
  }, [editando, confirmando, carregando])

  function abrirEdicao() {
    setEditName(name ?? '')
    setEditTags(tags ?? '')
    setEditando(true)
  }

  async function salvarEdicao() {
    if (!id || !editName.trim()) return
    setCarregando(true)
    const ok = await onEditar(id, editName.trim(), editTags.trim())
    setCarregando(false)
    if (ok) setEditando(false)
  }

  async function confirmarExclusao() {
    if (!id) return
    setCarregando(true)
    const ok = await onExcluir(id)
    setCarregando(false)
    if (ok) setConfirmando(false)
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-red-600/60 hover:shadow-[0_10px_40px_rgba(220,38,38,0.15)]">
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          <button
            onClick={() => id && onFavoritar(id)}
            title={favorite ? 'Remover dos favoritos' : 'Favoritar'}
            aria-label={favorite ? 'Remover dos favoritos' : 'Favoritar'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white/80 backdrop-blur transition hover:scale-110 hover:text-white"
          >
            <Heart size={18} className={favorite ? 'fill-red-600 text-red-600' : ''} />
          </button>
          <button
            onClick={abrirEdicao}
            title="Editar"
            aria-label="Editar"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white/80 backdrop-blur transition hover:scale-110 hover:text-white"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => setConfirmando(true)}
            title="Excluir"
            aria-label="Excluir"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white/80 backdrop-blur transition hover:scale-110 hover:text-white hover:!text-red-500"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <button onClick={onAbrir} title="Ver em tela cheia" className="block w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={name ?? 'Thumbnail'}
            className="h-56 w-full cursor-zoom-in object-cover"
          />
        </button>

        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h1 className="text-lg font-bold tracking-tight text-white">{name}</h1>
            <span className="rounded-full bg-red-600 px-3 py-0.5 text-xs font-bold text-white">
              {extension}
            </span>
          </div>
          <p className="text-sm text-white/60">
            {formatBytes(Number(size))} · {uploadDate}
          </p>

          {listaTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {listaTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => onTagClick?.(tag)}
                  title={`Buscar "${tag}"`}
                  className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-white/70 transition hover:border-red-600 hover:text-white"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* modal de edição */}
      {editando && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
          onClick={() => !carregando && setEditando(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-red-600/40 bg-neutral-950 p-6"
            onClick={event => event.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-bold text-white">
              Editar <span className="text-red-600">imagem</span>
            </h2>
            <label className="mb-1 block text-sm text-white/60">Nome</label>
            <input
              value={editName}
              onChange={event => setEditName(event.target.value)}
              className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-red-600"
            />
            <label className="mb-1 block text-sm text-white/60">Tags (separadas por vírgula)</label>
            <input
              value={editTags}
              onChange={event => setEditTags(event.target.value)}
              className="mb-6 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-red-600"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditando(false)}
                disabled={carregando}
                className="rounded-lg border border-white/20 px-4 py-2 font-bold text-white hover:bg-white/10 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarEdicao}
                disabled={carregando || !editName.trim()}
                className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {carregando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* confirmação de exclusão */}
      {confirmando && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
          onClick={() => !carregando && setConfirmando(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-red-600/40 bg-neutral-950 p-6 text-center"
            onClick={event => event.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-600/15 text-red-500">
              <Trash2 size={26} />
            </div>
            <h2 className="mt-3 text-xl font-bold text-white">Tem certeza?</h2>
            <p className="mt-2 text-sm text-white/60">
              A imagem <span className="font-bold text-white">&quot;{name}&quot;</span> será
              excluída e não poderá ser recuperada.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setConfirmando(false)}
                disabled={carregando}
                className="rounded-lg border border-white/20 px-4 py-2 font-bold text-white hover:bg-white/10 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                disabled={carregando}
                className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {carregando ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function formatBytes(bytes: number = 0, decimals: number = 2): string {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const absBytes = Math.abs(bytes);
  const i = Math.min(
    Math.floor(Math.log(absBytes) / Math.log(k)),
    sizes.length - 1
  );

  const formattedValue = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedValue} ${sizes[i]}`;
}