import { Component, input, output } from '@angular/core';
import { Sistema } from '../../../core/models';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-sistema-card',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './sistema-card.component.html',
  styleUrl: './sistema-card.component.scss',
})
export class SistemaCardComponent {
  sistema = input.required<Sistema>();
  compact = input(false);
  rank = input<number | null>(null);
  showStar = input(true);

  cardClick = output<Sistema>();
  favoriteClick = output<Sistema>();

  onCardClick(): void {
    this.cardClick.emit(this.sistema());
  }

  onFavorite(event: Event): void {
    event.stopPropagation();
    this.favoriteClick.emit(this.sistema());
  }
}
