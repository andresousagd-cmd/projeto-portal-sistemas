import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortaisExternosService } from '../../core/services/portais-externos.service';

@Component({
  selector: 'app-portais-externos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './portais-externos.component.html',
  styleUrl: './portais-externos.component.scss',
})
export class PortaisExternosComponent implements OnInit {
  private portaisService = inject(PortaisExternosService);

  readonly portais = this.portaisService.portais;

  nome = '';
  url = '';
  descricao = '';
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  ngOnInit(): void {
    this.portaisService.recarregar();
  }

  adicionar(): void {
    this.error.set(null);
    this.success.set(null);

    if (!this.nome.trim()) {
      this.error.set('Informe o nome do portal');
      return;
    }
    if (!this.url.trim()) {
      this.error.set('Informe a URL do portal');
      return;
    }

    try {
      new URL(this.url.trim().match(/^https?:\/\//i) ? this.url.trim() : `https://${this.url.trim()}`);
    } catch {
      this.error.set('URL inválida. Exemplo: https://portal.caixa.gov.br');
      return;
    }

    this.portaisService.adicionar({
      nome: this.nome,
      url: this.url,
      descricao: this.descricao || undefined,
    });

    this.nome = '';
    this.url = '';
    this.descricao = '';
    this.success.set('Portal adicionado com sucesso!');
  }

  remover(id: string, nome: string): void {
    if (confirm(`Remover o portal "${nome}" da sua lista?`)) {
      this.portaisService.remover(id);
      this.success.set('Portal removido.');
    }
  }

  abrir(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
