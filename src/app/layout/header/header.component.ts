import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LayoutUiService } from '../../core/services/layout-ui.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  layout = inject(LayoutUiService);
  private router = inject(Router);

  now = signal(new Date());
  private clockTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.clockTimer = setInterval(() => this.now.set(new Date()), 30_000);
  }

  ngOnDestroy(): void {
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  logout(): void {
    this.auth.logout();
    this.layout.closeSidebar();
    this.router.navigate(['/login']);
  }
}
