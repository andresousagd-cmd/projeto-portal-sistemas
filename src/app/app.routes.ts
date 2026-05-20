import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard],
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'search',
        loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent),
      },
      {
        path: 'portais-externos',
        loadComponent: () =>
          import('./features/portais-externos/portais-externos.component').then(m => m.PortaisExternosComponent),
      },
      {
        path: 'meu-dia',
        loadComponent: () =>
          import('./features/meu-dia/meu-dia.component').then(m => m.MeuDiaComponent),
      },
      {
        path: 'agente-ia',
        loadComponent: () =>
          import('./features/agente-ia/agente-ia.component').then(m => m.AgenteIaComponent),
      },
      {
        path: 'solicitar-acesso',
        loadComponent: () =>
          import('./features/solicitar-acesso/solicitar-acesso.component').then(m => m.SolicitarAcessoComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
