import { Component, input } from '@angular/core';

export type BadgeType = 'novo' | 'lancamento' | 'restrito' | 'liberado';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="badge" [class]="type()">{{ label() }}</span>`,
  styles: [`
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .novo { background: #DCFCE7; color: #166534; }
    .lancamento { background: #DBEAFE; color: #1E40AF; }
    .restrito { background: #FEF3C7; color: #92400E; }
    .liberado { background: #DCFCE7; color: #166534; }
  `],
})
export class BadgeComponent {
  type = input.required<BadgeType>();
  label = input.required<string>();
}
