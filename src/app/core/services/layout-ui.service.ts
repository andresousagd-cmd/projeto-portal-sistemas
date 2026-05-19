import { Injectable, signal, effect } from '@angular/core';

export type AppTheme = 'light' | 'dark';
export type AppFontSize = 'sm' | 'md' | 'lg';

const THEME_KEY = 'caixa_portal_theme';
const FONT_KEY = 'caixa_portal_font_size';

@Injectable({ providedIn: 'root' })
export class LayoutUiService {
  readonly sidebarOpen = signal(false);
  readonly theme = signal<AppTheme>(this.loadTheme());
  readonly fontSize = signal<AppFontSize>(this.loadFontSize());

  private readonly fontOrder: AppFontSize[] = ['sm', 'md', 'lg'];

  constructor() {
    this.applyToDocument();

    effect(() => {
      this.applyToDocument();
      localStorage.setItem(THEME_KEY, this.theme());
      localStorage.setItem(FONT_KEY, this.fontSize());
    });
  }

  private applyToDocument(): void {
    document.documentElement.dataset['theme'] = this.theme();
    document.documentElement.dataset['fontSize'] = this.fontSize();
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  toggleTheme(): void {
    this.theme.update(t => (t === 'light' ? 'dark' : 'light'));
  }

  cycleFontSize(): void {
    const idx = this.fontOrder.indexOf(this.fontSize());
    const next = this.fontOrder[(idx + 1) % this.fontOrder.length];
    this.fontSize.set(next);
  }

  fontSizeLabel(): string {
    const labels: Record<AppFontSize, string> = { sm: '12', md: '14', lg: '16' };
    return labels[this.fontSize()];
  }

  private loadTheme(): AppTheme {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  }

  private loadFontSize(): AppFontSize {
    const stored = localStorage.getItem(FONT_KEY);
    if (stored === 'sm' || stored === 'md' || stored === 'lg') return stored;
    return 'md';
  }
}
