'use client'
import { useState } from 'react'

const API = 'http://localhost:8080/images'

interface ImageCardProps {
  id?: string;
  imageUrl?: string;
  imageName?: string;
  imageSize?: string;
  uploadDate?: string;
  extension?: string;
  tags?: string;
  favorite?: boolean;
}

type Toast = { type: 'success' | 'error'; msg: string } | null

export const ImageCard: React.FC<ImageCardProps> = ({
  id, imageName, imageUrl, imageSize, uploadDate, extension, tags, favorite,
}) => {
  const [name, setName] = useState(imageName ?? '')
  const [currentTags, setCurrentTags] = useState(tags ?? '')
  const [isFavorite, setIsFavorite] = useState(!!favorite)
  const [deleted, setDeleted] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(imageName ?? '')
  const [editTags, setEditTags] = useState(tags ?? '')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<Toast>(null)

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3000)
  }

  function downloadImage() {
    window.open(imageUrl, '_blank');
  }

  async function handleDelete() {
    if (!id) return showToast('error', 'Imagem sem ID.')
    if (!window.confirm(`Excluir "${name}"?`)) return
    try {
      setLoading(true)
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setDeleted(true)
      showToast('success', 'Imagem excluída com sucesso!')
    } catch {
      showToast('error', 'Erro ao excluir a imagem.')
    } finally {
      setLoading(false)
    }
  }

  async function handleFavorite() {
    if (!id) return showToast('error', 'Imagem sem ID.')
    try {
      const res = await fetch(`${API}/${id}/favorite`, { method: 'PATCH' })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setIsFavorite(data.favorite)
      showToast('success', data.favorite ? 'Adicionada aos favoritos!' : 'Removida dos favoritos.')
    } catch {
      showToast('error', 'Erro ao atualizar favorito.')
    }
  }

  async function handleSave() {
    if (!id) return showToast('error', 'Imagem sem ID.')
    if (!editName.trim()) return showToast('error', 'O nome não pode ficar vazio.')
    try {
      setLoading(true)
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), tags: editTags }),
      })
      if (!res.ok) throw new Error()
      setName(editName.trim())
      setCurrentTags(editTags)
      setEditing(false)
      showToast('success', 'Imagem atualizada com sucesso!')
    } catch {
      showToast('error', 'Erro ao atualizar a imagem.')
    } finally {
      setLoading(false)
    }
  }

  const toastEl = toast && (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg ${
        toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      {toast.msg}
    </div>
  )

  if (deleted) return <>{toastEl}</>

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-red-600/60 hover:shadow-[0_10px_40px_rgba(220,38,38,0.15)]">
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          <button
            onClick={handleFavorite}
            title="Favoritar"
            className="rounded-full bg-black/70 px-2.5 py-1 text-base transition hover:scale-110"
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          <button
            onClick={() => { setEditName(name); setEditTags(currentTags); setEditing(true) }}
            title="Editar"
            className="rounded-full bg-black/70 px-2.5 py-1 text-base transition hover:scale-110"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            title="Excluir"
            className="rounded-full bg-black/70 px-2.5 py-1 text-base transition hover:scale-110 disabled:opacity-50"
          >
            🗑️
          </button>
        </div>

        <img
          onClick={downloadImage}
          src={imageUrl}
          alt={name ?? 'Thumbnail'}
          className="h-56 w-full cursor-pointer object-cover"
        />
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h1 className="text-lg font-bold tracking-tight text-white">{name}</h1>
            <span className="rounded-full bg-red-600 px-3 py-0.5 text-xs font-bold text-white">
              {extension}
            </span>
          </div>
          <p className="text-sm text-white/60">
            {formatBytes(Number(imageSize))} · {uploadDate}
          </p>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-600/40 bg-neutral-950 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Editar imagem</h2>
            <label className="mb-1 block text-sm text-white/60">Nome</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-red-600"
            />
            <label className="mb-1 block text-sm text-white/60">Tags (separadas por vírgula)</label>
            <input
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              className="mb-6 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-red-600"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border border-white/20 px-4 py-2 font-bold text-white hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {toastEl}
    </>
  )
}

function formatBytes(bytes: number = 0, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

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