class AuthService {
  baseURL: string = 'http://localhost:8080/users';

  // cria a conta (o back-end criptografa a senha com BCrypt)
  async cadastrar(name: string, email: string, password: string): Promise<void> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.status === 409) {
      throw new Error('Este e-mail já está cadastrado.');
    }
    if (!response.ok) {
      throw new Error('Não foi possível criar a conta.');
    }
  }

  // autentica e devolve o token JWT
  async entrar(email: string, password: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 401) {
      throw new Error('E-mail ou senha inválidos.');
    }
    if (!response.ok) {
      throw new Error('Não foi possível entrar na conta.');
    }
    const data = await response.json();
    return data.accessToken;
  }

  salvarToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  obterToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

// React Hook
export const useAuthService = () => new AuthService();