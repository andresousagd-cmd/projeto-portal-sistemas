import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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

  navItems = [
    { path: '/home', label: 'Home', icon: '⌂' },
    { path: '/search', label: 'Buscar', icon: '🔍' },
    { path: '/home', label: 'Favoritos', icon: '★', fragment: 'favoritos' },
    { path: '/home', label: 'Lançamentos', icon: '🚀', fragment: 'lancamentos' },
  ];

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
