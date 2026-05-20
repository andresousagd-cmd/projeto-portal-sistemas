import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap, map, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HomeData, SearchResult, Sistema, SolicitacaoAcessoRequest } from '../models';
import { MOCK_SISTEMAS, getMockHomeData, searchMockSistemas } from '../data/mock-data';

const FAVORITOS_KEY = 'caixa_portal_favoritos';
const RECENTES_KEY = 'caixa_portal_recentes';

@Injectable({ providedIn: 'root' })
export class SistemasService {
  private readonly _favoritosIds = signal<number[]>(this.loadIds(FAVORITOS_KEY));
  private readonly _recentesIds = signal<number[]>(this.loadIds(RECENTES_KEY));

  constructor(private http: HttpClient) {}

  getHome(): Observable<HomeData> {
    if (environment.useMock) {
      return of(getMockHomeData(this._favoritosIds(), this._recentesIds()));
    }
    return this.http.get<HomeData>(`${environment.apiUrl}/sistemas/home`).pipe(
      catchError(() => of(getMockHomeData(this._favoritosIds(), this._recentesIds())))
    );
  }

  listarTodos(): Sistema[] {
    return this.enrichSistemas([...MOCK_SISTEMAS]);
  }

  search(query: string, page = 1, pageSize = 10, categoria?: string): Observable<SearchResult> {
    if (environment.useMock) {
      const { items, total } = searchMockSistemas(query, page, pageSize, categoria);
      return of({
        items: this.enrichSistemas(items),
        total,
        page,
        pageSize,
      });
    }
    let params = new HttpParams()
      .set('q', query)
      .set('page', page)
      .set('pageSize', pageSize);
    if (categoria) {
      params = params.set('categoria', categoria);
    }
    return this.http.get<SearchResult>(`${environment.apiUrl}/sistemas/search`, { params }).pipe(
      map(r => ({ ...r, items: this.enrichSistemas(r.items) })),
      catchError(() => {
        const { items, total } = searchMockSistemas(query, page, pageSize, categoria);
        return of({ items: this.enrichSistemas(items), total, page, pageSize });
      })
    );
  }

  getById(id: number): Sistema | undefined {
    return MOCK_SISTEMAS.find(s => s.id === id);
  }

  registrarClique(sistemaId: number): Observable<void> {
    this.addRecente(sistemaId);
    if (environment.useMock) return of(void 0);
    return this.http.post<void>(`${environment.apiUrl}/sistemas/clique`, { sistemaId }).pipe(
      catchError(() => of(void 0))
    );
  }

  favoritar(sistemaId: number): Observable<boolean> {
    const ids = [...this._favoritosIds()];
    const idx = ids.indexOf(sistemaId);
    if (idx >= 0) ids.splice(idx, 1);
    else ids.push(sistemaId);
    this._favoritosIds.set(ids);
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(ids));

    if (environment.useMock) return of(idx < 0);
    return this.http.post<{ favorito: boolean }>(`${environment.apiUrl}/sistemas/favoritar`, { sistemaId }).pipe(
      map(r => r.favorito),
      catchError(() => of(idx < 0))
    );
  }

  isFavorito(sistemaId: number): boolean {
    return this._favoritosIds().includes(sistemaId);
  }

  solicitarAcesso(request: SolicitacaoAcessoRequest): Observable<void> {
    if (environment.useMock) return of(void 0);
    return this.http.post<void>(`${environment.apiUrl}/sistemas/solicitar-acesso`, request);
  }

  private enrichSistemas(sistemas: Sistema[]): Sistema[] {
    return sistemas.map(s => ({
      ...s,
      favorito: this.isFavorito(s.id),
    }));
  }

  private addRecente(sistemaId: number): void {
    let ids = this._recentesIds().filter(id => id !== sistemaId);
    ids = [sistemaId, ...ids].slice(0, 10);
    this._recentesIds.set(ids);
    localStorage.setItem(RECENTES_KEY, JSON.stringify(ids));
  }

  private loadIds(key: string): number[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  }
}
