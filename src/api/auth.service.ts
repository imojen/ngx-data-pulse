export class AuthService {
  private static token: string | null = null;

  static setToken(token: string): void {
    this.token = token;
  }

  static clearToken(): void {
    this.token = null;
  }

  static getAuthHeader(): { Authorization?: string } {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}
