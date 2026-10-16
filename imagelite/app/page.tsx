import { PrimeiroComponente } from './components/PrimeiroComponente';
import { Recursos } from './components/Recursos';
import { ComoFunciona } from './components/ComoFunciona';
import { Rodape } from './components/Rodape';

export default function Home() {
  return (
    <>
      <PrimeiroComponente
        mensagem="Faça upload, adicione tags e pesquise por nome ou formato. Tudo em um único lugar, sem complicação."
        mensagemBotao="Acessar Galeria"
      />
      <Recursos />
      <ComoFunciona />
      <Rodape />
    </>
  );
}