import { Component, input, output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Sistema } from '../../../core/models';
import { BadgeComponent } from '../badge/badge.component';
import { SistemasService } from '../../../core/services/sistemas.service';

@Component({
  selector: 'app-sistema-modal',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './sistema-modal.component.html',
  styleUrl: './sistema-modal.component.scss',
})
export class SistemaModalComponent {
  sistema = input.required<Sistema>();
  close = output<void>();
  favoriteToggle = output<Sistema>();

  private router = inject(Router);
  private sistemasService = inject(SistemasService);

  onClose(): void {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.onClose();
    }
  }

  onFavorite(): void {
    this.favoriteToggle.emit(this.sistema());
  }

  onAcessar(): void {
    const s = this.sistema();
    this.sistemasService.registrarClique(s.id).subscribe();
    if (s.liberado && s.urlAcesso) {
      window.open(s.urlAcesso, '_blank');
    }
  }

  onSolicitarAcesso(): void {
    this.router.navigate(['/solicitar-acesso'], { queryParams: { sistemaId: this.sistema().id } });
    this.onClose();
  }
}
