import { Image } from "./image";

class ImageService {
  baseURL: string = 'http://localhost:8080/images';
  //colocar os parametros de busca na URL
  async buscar(query: string='',extension?: string): Promise<Image[]> {

    const url = `${this.baseURL}?query=${query}&extension=${extension}`
    const response = await fetch(url);
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
}
// React Hook
export const useImageService = () => new ImageService();