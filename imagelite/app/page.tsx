import { PrimeiroComponente } from './components/PrimeiroComponente';

export default function Home() {
  return (
    <PrimeiroComponente
      mensagem="Faça upload, adicione tags e pesquise por nome ou formato. Tudo em um único lugar, sem complicação."
      mensagemBotao="Acessar Galeria"
    />
  );
}
