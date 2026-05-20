import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Sistema } from '../../core/models';
import { MEU_DIA_MAX_SISTEMAS, MeuDiaService } from '../../core/services/meu-dia.service';
import { SistemasService } from '../../core/services/sistemas.service';

@Component({
  selector: 'app-meu-dia',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './meu-dia.component.html',
  styleUrl: './meu-dia.component.scss',
})
export class MeuDiaComponent {
  meuDia = inject(MeuDiaService);
  private sistemasService = inject(SistemasService);

  readonly maxSistemas = MEU_DIA_MAX_SISTEMAS;
  readonly todosSistemas = this.sistemasService.listarTodos();
  aviso = signal<string | null>(null);

  alternar(sistema: Sistema): void {
    this.aviso.set(null);
    if (this.meuDia.isSelecionado(sistema.id)) {
      this.meuDia.alternar(sistema.id);
      return;
    }
    if (!this.meuDia.alternar(sistema.id)) {
      this.aviso.set(`Você pode selecionar no máximo ${MEU_DIA_MAX_SISTEMAS} sistemas.`);
    }
  }
}
