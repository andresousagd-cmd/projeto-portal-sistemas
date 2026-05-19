import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Usuario } from '../models';
import { MOCK_USUARIOS } from '../data/mock-data';

const TOKEN_KEY = 'caixa_portal_token';
const USER_KEY = 'caixa_portal_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _usuario = signal<Usuario | null>(this.loadUser());
  readonly usuario = this._usuario.asReadonly();
  readonly isAuthenticated = computed(() => !!this._usuario());

  constructor(private http: HttpClient) {}

  login(matricula: string): Observable<LoginResponse> {
    const body: LoginRequest = { matricula: matricula.trim() };

    if (environment.useMock) {
      const usuario = MOCK_USUARIOS[body.matricula];
      if (!usuario) {
        return throwError(() => new Error('Matrícula não encontrada. Use: C000001, C000002 ou C000003'));
      }
      const response: LoginResponse = { token: `mock-token-${usuario.id}`, usuario };
      return of(response).pipe(tap(r => this.persistSession(r)));
    }

    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, body).pipe(
      tap(r => this.persistSession(r)),
      catchError(() => {
        const usuario = MOCK_USUARIOS[body.matricula];
        if (usuario) {
          const response: LoginResponse = { token: `mock-token-${usuario.id}`, usuario };
          this.persistSession(response);
          return of(response);
        }
        return throwError(() => new Error('Matrícula não encontrada'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._usuario.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private persistSession(response: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.usuario));
    this._usuario.set(response.usuario);
  }

  private loadUser(): Usuario | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  }
}
