'use client'
import { useEffect, useState } from 'react';

interface AddImageModalProps {
  aberto: boolean;
  onFechar: () => void;
  onSalvar: (file: File, name: string, tags: string) => Promise<void>;
}

export default function AddImageModal({ aberto, onFechar, onSalvar }: AddImageModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [enviando, setEnviando] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');
  const [preview, setPreview] = useState<string>('');

  // cria e limpa a pré-visualização da imagem escolhida
  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function limparCampos() {
    setFile(null);
    setName('');
    setTags('');
    setErro('');
  }

  function fechar() {
    if (enviando) return;
    limparCampos();
    onFechar();
  }

  function escolherArquivo(arquivo: File | null) {
    setFile(arquivo);
    // sugere o nome da imagem a partir do nome do arquivo
    if (arquivo && !name) {
      setName(arquivo.name.replace(/\.[^/.]+$/, ''));
    }
  }

  async function enviar() {
    if (!file) {
      setErro('Escolha uma imagem para enviar.');
      return;
    }
    if (!name.trim()) {
      setErro('Dê um nome para a imagem.');
      return;
    }

    setErro('');
    setEnviando(true);
    try {
      await onSalvar(file, name.trim(), tags.trim());
      limparCampos();
    } catch {
      setErro('Não foi possível enviar a imagem. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      onClick={fechar}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-red-900/40 bg-neutral-950 p-6 text-white shadow-[0_0_40px_rgba(220,38,38,0.25)]"
        onClick={event => event.stopPropagation()}
      >
        <h3 className="text-2xl font-extrabold">
          Adicionar <span className="text-red-600">imagem</span>
        </h3>
        <div className="mt-2 h-1 w-12 rounded-full bg-red-600" />

        <div className="mt-6 space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-center text-sm text-white/60 transition hover:border-red-600">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Pré-visualização" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <span>Clique para escolher uma imagem</span>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/gif"
              className="hidden"
              onChange={event => escolherArquivo(event.target.files?.[0] ?? null)}
            />
          </label>

          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Nome da imagem"
            className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/40 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30"
          />

          <input
            type="text"
            value={tags}
            onChange={event => setTags(event.target.value)}
            placeholder="Tags separadas por vírgula (ex: maracanã, torcida)"
            className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/40 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30"
          />

          {erro && <p className="text-sm text-red-500">{erro}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={fechar}
            disabled={enviando}
            className="h-11 rounded-lg border border-white/20 px-5 font-bold text-white transition hover:bg-white/10 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            onClick={enviar}
            disabled={enviando}
            className="h-11 rounded-lg bg-red-600 px-5 font-bold text-white shadow-[0_6px_24px_rgba(220,38,38,0.35)] transition hover:bg-red-700 disabled:opacity-60"
          >
            {enviando ? 'Enviando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}