import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Sistema } from '../../core/models';
import { SistemasService } from '../../core/services/sistemas.service';
import { SistemaCardComponent } from '../../shared/components/sistema-card/sistema-card.component';
import { SistemaModalComponent } from '../../shared/components/sistema-modal/sistema-modal.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, SistemaCardComponent, SistemaModalComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  query = signal('');
  categoria = signal<string | null>(null);
  results = signal<Sistema[]>([]);
  total = signal(0);
  page = signal(1);
  pageSize = 10;
  loading = signal(false);
  selectedSistema = signal<Sistema | null>(null);

  titulo = computed(() => {
    const cat = this.categoria();
    const q = this.query();
    if (cat && q) return `“${q}” em ${cat}`;
    if (cat) return cat;
    if (q) return `“${q}”`;
    return 'Busca';
  });

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sistemasService = inject(SistemasService);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = (params['q'] as string) || '';
      const cat = (params['categoria'] as string) || null;
      const page = Number(params['page']) || 1;
      this.query.set(q);
      this.categoria.set(cat);
      this.page.set(page);
      if (q || cat) {
        this.buscar(q, page, cat ?? undefined);
      } else {
        this.results.set([]);
        this.total.set(0);
      }
    });
  }

  buscar(q: string, page = 1, categoria?: string): void {
    this.loading.set(true);
    this.sistemasService.search(q, page, this.pageSize, categoria).subscribe({
      next: res => {
        this.results.set(res.items);
        this.total.set(res.total);
        this.page.set(res.page);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  goToPage(p: number): void {
    const params: Record<string, string | number> = { page: p };
    if (this.query()) params['q'] = this.query();
    if (this.categoria()) params['categoria'] = this.categoria()!;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
    });
  }

  totalPages(): number {
    return Math.ceil(this.total() / this.pageSize) || 1;
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
      this.results.update(list =>
        list.map(s => (s.id === sistema.id ? { ...s, favorito: fav } : s))
      );
      if (this.selectedSistema()?.id === sistema.id) {
        this.selectedSistema.set({ ...sistema, favorito: fav });
      }
    });
  }
}
