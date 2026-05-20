import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { PortalExterno, PortalExternoInput } from '../models';
import { AuthService } from './auth.service';

const STORAGE_PREFIX = 'caixa_portal_portais_';

@Injectable({ providedIn: 'root' })
export class PortaisExternosService {
  private auth = inject(AuthService);
  private readonly _portais = signal<PortalExterno[]>([]);
  readonly portais = this._portais.asReadonly();
  readonly total = computed(() => this._portais().length);

  constructor() {
    effect(() => {
      const matricula = this.auth.usuario()?.matricula;
      this._portais.set(matricula ? this.loadFromStorage(matricula) : []);
    });
  }

  recarregar(): void {
    const matricula = this.auth.usuario()?.matricula;
    this._portais.set(matricula ? this.loadFromStorage(matricula) : []);
  }

  adicionar(input: PortalExternoInput): PortalExterno {
    const matricula = this.requireMatricula();
    const portal: PortalExterno = {
      id: crypto.randomUUID(),
      nome: input.nome.trim(),
      url: this.normalizarUrl(input.url),
      descricao: input.descricao?.trim() || undefined,
      criadoEm: new Date().toISOString(),
    };
    const atualizados = [portal, ...this._portais()];
    this.persistir(matricula, atualizados);
    return portal;
  }

  remover(id: string): void {
    const matricula = this.requireMatricula();
    const atualizados = this._portais().filter(p => p.id !== id);
    this.persistir(matricula, atualizados);
  }

  private persistir(matricula: string, portais: PortalExterno[]): void {
    localStorage.setItem(this.storageKey(matricula), JSON.stringify(portais));
    this._portais.set(portais);
  }

  private loadFromStorage(matricula: string): PortalExterno[] {
    const raw = localStorage.getItem(this.storageKey(matricula));
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as PortalExterno[];
      return Array.isArray(parsed) ? parsed : [];
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

  private normalizarUrl(url: string): string {
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  }
}
