import { Component, OnInit, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeData, Sistema } from '../../core/models';
import { SistemasService } from '../../core/services/sistemas.service';
import { MeuDiaService } from '../../core/services/meu-dia.service';
import { SistemaCardComponent } from '../../shared/components/sistema-card/sistema-card.component';
import { SistemaModalComponent } from '../../shared/components/sistema-modal/sistema-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink, SistemaCardComponent, SistemaModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  searchQuery = '';
  loading = signal(true);
  homeData = signal<HomeData | null>(null);
  selectedSistema = signal<Sistema | null>(null);

  meuDia = inject(MeuDiaService);
  private sistemasService = inject(SistemasService);
  private router = inject(Router);

  meuDiaAviso = signal<string | null>(null);

  ngOnInit(): void {
    this.sistemasService.getHome().subscribe({
      next: data => {
        this.homeData.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(): void {
    const q = this.searchQuery.trim();
    if (q) {
      this.router.navigate(['/search'], { queryParams: { q } });
    }
  }

  iniciarMeuDia(): void {
    this.meuDiaAviso.set(null);
    const abertos = this.meuDia.iniciarDia();
    if (abertos === 0) {
      this.meuDiaAviso.set('Configure até 5 sistemas em "Meu dia" no menu lateral.');
      this.router.navigate(['/meu-dia']);
    }
  }

  openSistema(sistema: Sistema): void {
    this.selectedSistema.set({ ...sistema, favorito: this.sistemasService.isFavorito(sistema.id) });
  }

  closeModal(): void {
    this.selectedSistema.set(null);
  }

  toggleFavorite(sistema: Sistema): void {
    this.sistemasService.favoritar(sistema.id).subscribe(() => {
      const fav = this.sistemasService.isFavorito(sistema.id);
      if (this.selectedSistema()?.id === sistema.id) {
        this.selectedSistema.set({ ...sistema, favorito: fav });
      }
      this.refreshHome();
    });
  }

  private refreshHome(): void {
    this.sistemasService.getHome().subscribe(data => this.homeData.set(data));
  }
}
