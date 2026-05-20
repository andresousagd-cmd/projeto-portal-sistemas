import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SistemaStatusConsulta, StatusOperacionalSistema } from '../../core/models';
import { StatusSistemasService } from '../../core/services/status-sistemas.service';

@Component({
  selector: 'app-status-sistemas',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './status-sistemas.component.html',
  styleUrl: './status-sistemas.component.scss',
})
export class StatusSistemasComponent {
  private statusService = inject(StatusSistemasService);

  termoBusca = '';
  buscando = signal(false);
  buscou = signal(false);
  resultados = signal<SistemaStatusConsulta[]>([]);

  readonly legenda: { status: StatusOperacionalSistema; label: string; cor: string }[] = [
    { status: 'disponivel', label: 'Disponível', cor: '#22c55e' },
    { status: 'lentidao', label: 'Com lentidão', cor: '#eab308' },
    { status: 'indisponivel', label: 'Indisponível', cor: '#ef4444' },
  ];

  buscar(): void {
    const termo = this.termoBusca.trim();
    if (!termo) return;

    this.buscando.set(true);
    this.buscou.set(true);
    this.statusService.consultar(termo).subscribe({
      next: lista => {
        this.resultados.set(lista);
        this.buscando.set(false);
      },
      error: () => this.buscando.set(false),
    });
  }

  labelStatus(status: StatusOperacionalSistema): string {
    const item = this.legenda.find(l => l.status === status);
    return item?.label ?? status;
  }
}
