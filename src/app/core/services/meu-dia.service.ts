import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Sistema } from '../models';
import { AuthService } from './auth.service';
import { SistemasService } from './sistemas.service';

const STORAGE_PREFIX = 'caixa_portal_meu_dia_';
export const MEU_DIA_MAX_SISTEMAS = 5;

@Injectable({ providedIn: 'root' })
export class MeuDiaService {
  private auth = inject(AuthService);
  private sistemasService = inject(SistemasService);

  private readonly _selecionados = signal<number[]>([]);
  readonly selecionados = this._selecionados.asReadonly();
  readonly quantidade = computed(() => this._selecionados().length);
  readonly podeAdicionar = computed(() => this._selecionados().length < MEU_DIA_MAX_SISTEMAS);

  readonly sistemasSelecionados = computed(() =>
    this._selecionados()
      .map(id => this.sistemasService.getById(id))
      .filter((s): s is Sistema => !!s)
  );

  constructor() {
    effect(() => {
      const matricula = this.auth.usuario()?.matricula;
      this._selecionados.set(matricula ? this.loadFromStorage(matricula) : []);
    });
  }

  isSelecionado(sistemaId: number): boolean {
    return this._selecionados().includes(sistemaId);
  }

  alternar(sistemaId: number): boolean {
    const matricula = this.requireMatricula();
    const atual = [...this._selecionados()];
    const idx = atual.indexOf(sistemaId);

    if (idx >= 0) {
      atual.splice(idx, 1);
      this.persistir(matricula, atual);
      return true;
    }

    if (atual.length >= MEU_DIA_MAX_SISTEMAS) {
      return false;
    }

    atual.push(sistemaId);
    this.persistir(matricula, atual);
    return true;
  }

  remover(sistemaId: number): void {
    const matricula = this.requireMatricula();
    const atual = this._selecionados().filter(id => id !== sistemaId);
    this.persistir(matricula, atual);
  }

  iniciarDia(): number {
    const sistemas = this.sistemasSelecionados();
    sistemas.forEach(s => {
      this.sistemasService.registrarClique(s.id).subscribe();
      window.open(s.urlAcesso, '_blank', 'noopener,noreferrer');
    });
    return sistemas.length;
  }

  private persistir(matricula: string, ids: number[]): void {
    localStorage.setItem(this.storageKey(matricula), JSON.stringify(ids));
    this._selecionados.set(ids);
  }

  private loadFromStorage(matricula: string): number[] {
    const raw = localStorage.getItem(this.storageKey(matricula));
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as number[];
      return Array.isArray(parsed) ? parsed.slice(0, MEU_DIA_MAX_SISTEMAS) : [];
    } catch {
      return [];
    }
  }

  private storageKey(matricula: string): string {
    return `${STORAGE_PREFIX}${matricula}`;
  }

  private requireMatricula(): string {
    const matricula = this.auth.usuario()?.matricula;
    if (!matricula) throw new Error('Usuário não autenticado');
    return matricula;
  }
}
