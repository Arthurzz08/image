'use client'
interface ImageCardProps {
  imageUrl?: string;
  imageName?: string;
  imageSize?: string;
  uploadDate?: string;
  extension?: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({ imageName, imageUrl, imageSize, uploadDate, extension }) => {

  function downloadImage() {
    window.open(imageUrl, '_blank');
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-red-600/60 hover:shadow-[0_10px_40px_rgba(220,38,38,0.15)]">
      <img
        onClick={downloadImage}
        src={imageUrl}
        alt={imageName ?? 'Thumbnail'}
        className="h-56 w-full cursor-pointer object-cover"
      />
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h1 className="text-lg font-bold tracking-tight text-white">{imageName}</h1>
          <span className="rounded-full bg-red-600 px-3 py-0.5 text-xs font-bold text-white">
            {extension}
          </span>
        </div>
        <p className="text-sm text-white/60">
          {formatBytes(Number(imageSize))} · {uploadDate}
        </p>
      </div>
    </div>
  )
}

function formatBytes(bytes: number = 0, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const absBytes = Math.abs(bytes);

  // Evita estourar o tamanho do array sizes
  const i = Math.min(
    Math.floor(Math.log(absBytes) / Math.log(k)),
    sizes.length - 1
  );

  const formattedValue = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedValue} ${sizes[i]}`;
}