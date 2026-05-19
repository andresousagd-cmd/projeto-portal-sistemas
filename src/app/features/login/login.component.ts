import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  matricula = '';
  senha = '';
  loading = signal(false);
  error = signal<string | null>(null);

  private auth = inject(AuthService);
  private router = inject(Router);

  entrar(): void {
    if (!this.matricula.trim()) {
      this.error.set('Informe sua matrícula');
      return;
    }
    if (!this.senha) {
      this.error.set('Informe sua senha');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.auth.login(this.matricula.trim().toUpperCase()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.error.set(err?.message || 'Erro ao entrar');
      },
    });
  }
}
