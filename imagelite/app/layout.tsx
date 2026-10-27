import type { Metadata } from "next";
import { Inter, Kanit } from "next/font/google";
import "./globals.css";

// fonte do texto geral (botões, campos, descrições)
const corpo = Inter({
  variable: "--font-corpo",
  subsets: ["latin"],
});

// fonte dos títulos (estilo esportivo, itálico dá sensação de velocidade)
const titulo = Kanit({
  variable: "--font-titulo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Galeria do Mengão",
  description: "Galeria de imagens da Nação Rubro-Negra",
  icons: {
    icon: "/flamengo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${corpo.variable} ${titulo.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}