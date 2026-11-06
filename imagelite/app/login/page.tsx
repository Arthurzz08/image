'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Template } from '../components/Template';
import Toast, { type Aviso } from '../components/Toast';
import { useAuthService } from '../resource/auth';

interface Erros {
  name?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAMANHO_MINIMO_SENHA = 6;

const CLASSE_CAMPO =
  'h-11 w-full rounded-lg border bg-white/5 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-600/30';

export default function LoginPage() {
  const auth = useAuthService();
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState<boolean>(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);

  // devolve os erros de cada campo (objeto vazio = tudo certo)
  function validar(): Erros {
    const novos: Erros = {};
    if (!name.trim()) novos.name = 'Informe seu nome.';
    if (!EMAIL_REGEX.test(email.trim())) novos.email = 'Informe um e-mail válido.';
    if (password.length < TAMANHO_MINIMO_SENHA) {
      novos.password = `A senha deve ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`;
    }
    if (repeatPassword !== password) novos.repeatPassword = 'As senhas não são iguais.';
    return novos;
  }

  async function enviar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const novos = validar();
    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    setEnviando(true);
    try {
      const emailLimpo = email.trim().toLowerCase();
      await auth.cadastrar(name.trim(), emailLimpo, password);
      const token = await auth.entrar(emailLimpo, password);
      auth.salvarToken(token);
      router.push('/galeria');
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Algo deu errado. Tente novamente.';
      setAviso({ tipo: 'erro', mensagem });
    } finally {
      setEnviando(false);
    }
  }

  function bordaDe(erro?: string) {
    return erro ? 'border-red-500' : 'border-white/10 focus:border-red-600';
  }

  return (
    <Template>
      <div className="flex items-center justify-center px-4 py-12">
        <form
          onSubmit={enviar}
          noValidate
          className="w-full max-w-md rounded-2xl border border-red-900/40 bg-neutral-950 p-6 text-white shadow-[0_0_40px_rgba(220,38,38,0.25)]"
        >
          <h1 className="text-center text-2xl font-extrabold">
            Login to your <span className="text-red-600">account</span>
          </h1>
          <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-red-600" />

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm text-white/70">Name:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={event => setName(event.target.value)}
                autoComplete="name"
                className={`${CLASSE_CAMPO} ${bordaDe(erros.name)}`}
              />
              {erros.name && <p className="mt-1 text-sm text-red-500">{erros.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-white/70">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                autoComplete="email"
                className={`${CLASSE_CAMPO} ${bordaDe(erros.email)}`}
              />
              {erros.email && <p className="mt-1 text-sm text-red-500">{erros.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-white/70">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete="new-password"
                className={`${CLASSE_CAMPO} ${bordaDe(erros.password)}`}
              />
              {erros.password && <p className="mt-1 text-sm text-red-500">{erros.password}</p>}
            </div>

            <div>
              <label htmlFor="repeatPassword" className="mb-1 block text-sm text-white/70">Repeat Password:</label>
              <input
                id="repeatPassword"
                type="password"
                value={repeatPassword}
                onChange={event => setRepeatPassword(event.target.value)}
                autoComplete="new-password"
                className={`${CLASSE_CAMPO} ${bordaDe(erros.repeatPassword)}`}
              />
              {erros.repeatPassword && <p className="mt-1 text-sm text-red-500">{erros.repeatPassword}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="mt-6 h-11 w-full rounded-lg bg-red-600 font-bold text-white shadow-[0_6px_24px_rgba(220,38,38,0.35)] transition hover:bg-red-700 disabled:opacity-60"
          >
            {enviando ? 'Enviando...' : 'Create account'}
          </button>
        </form>
      </div>

      <Toast aviso={aviso} onFechar={() => setAviso(null)} />
    </Template>
  );
}