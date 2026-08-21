import { Image } from "./image";

class ImageService {
  baseURL: string = 'http://localhost:8080/v1/image';

  async buscar(): Promise<Image[]> {
    const response = await fetch(this.baseURL);
    return await response.json();
  }
}

export const useImage = () => new ImageService();

