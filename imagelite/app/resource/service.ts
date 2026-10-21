import { Image } from "./image";

class ImageService {
  baseURL: string = 'http://localhost:8080/images';

  // coloca os parâmetros de busca na URL (só os que têm valor, com encoding)
  async buscar(query: string = '', extension: string = ''): Promise<Image[]> {
    const params = new URLSearchParams();
    if (query.trim()) params.set('query', query.trim());
    if (extension) params.set('extension', extension);

    const url = params.toString() ? `${this.baseURL}?${params}` : this.baseURL;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Falha ao buscar as imagens');
    }
    return await response.json();
  }

  // envia uma nova imagem (multipart/form-data)
  async salvar(file: File, name: string, tags: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('tags', tags);

    // não definir Content-Type: o navegador coloca o boundary sozinho
    const response = await fetch(this.baseURL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Falha ao enviar a imagem');
    }
  }

  async excluir(id: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Falha ao excluir a imagem');
    }
  }

  // alterna o favorito e devolve o novo valor
  async favoritar(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseURL}/${id}/favorite`, { method: 'PATCH' });
    if (!response.ok) {
      throw new Error('Falha ao atualizar o favorito');
    }
    const data = await response.json();
    return !!data.favorite;
  }

  async atualizar(id: string, name: string, tags: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, tags }),
    });
    if (!response.ok) {
      throw new Error('Falha ao atualizar a imagem');
    }
  }

  // baixa o arquivo de verdade (o atributo "download" não funciona entre origens diferentes)
  async baixar(image: Image): Promise<void> {
    if (!image.url) throw new Error('Imagem sem URL');

    const response = await fetch(image.url);
    if (!response.ok) {
      throw new Error('Falha ao baixar a imagem');
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${image.name ?? 'imagem'}.${(image.extension ?? '').toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  }
}

// React Hook
export const useImageService = () => new ImageService();