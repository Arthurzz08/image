import Link from 'next/link';

interface TemplateProps {
  children: React.ReactNode;
}

export const Template: React.FC<TemplateProps> = ({ children }: TemplateProps) => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      {/* Glows de fundo (mesmos da página inicial) */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-red-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-red-700/20 blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <header className="border-b border-white/10 bg-black/55 py-4 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          Image<span className="text-red-600">Lite</span>
        </Link>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black/55 py-4 text-sm text-white/60 backdrop-blur">
      <div className="container mx-auto px-4">
        <p>Developed by Arthur Henrique</p>
      </div>
    </footer>
  );
};