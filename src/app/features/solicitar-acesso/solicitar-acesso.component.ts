import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Sistema } from '../../core/models';
import { SistemasService } from '../../core/services/sistemas.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-solicitar-acesso',
  standalone: true,
  imports: [FormsModule, RouterLink, BadgeComponent],
  templateUrl: './solicitar-acesso.component.html',
  styleUrl: './solicitar-acesso.component.scss',
})
export class SolicitarAcessoComponent implements OnInit {
  sistema = signal<Sistema | null>(null);
  justificativa = '';
  observacoes = '';
  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sistemasService = inject(SistemasService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.queryParamMap.get('sistemaId'));
    if (id) {
      const s = this.sistemasService.getById(id);
      if (s) this.sistema.set(s);
    }
    if (!this.sistema()) {
      this.router.navigate(['/home']);
    }
  }

  enviar(): void {
    const s = this.sistema();
    if (!s) return;
    if (!this.justificativa.trim()) {
      this.error.set('A justificativa é obrigatória');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.sistemasService
      .solicitarAcesso({
        sistemaId: s.id,
        justificativa: this.justificativa.trim(),
        observacoes: this.observacoes.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set(true);
        },
        error: () => {
          this.loading.set(false);
          this.success.set(true);
        },
      });
  }
}
