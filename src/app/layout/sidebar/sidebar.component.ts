import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CATEGORIAS_CAIXA } from '../../core/constants/categorias';
import { AuthService } from '../../core/services/auth.service';
import { MeuDiaService } from '../../core/services/meu-dia.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  meuDia = inject(MeuDiaService);

  categoriasAbertas = signal(true);

  readonly categorias = CATEGORIAS_CAIXA;

  navItems = [
    { path: '/home', label: 'Home', icon: '⌂' },
    { path: '/search', label: 'Buscar', icon: '🔍' },
    { path: '/portais-externos', label: 'Meus portais', icon: '🔗' },
    { path: '/meu-dia', label: 'Meu dia', icon: '☀' },
    { path: '/home', label: 'Favoritos', icon: '★', fragment: 'favoritos' },
    { path: '/home', label: 'Lançamentos', icon: '🚀', fragment: 'lancamentos' },
  ];

  toggleCategorias(): void {
    this.categoriasAbertas.update(v => !v);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
