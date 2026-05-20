import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { SistemaStatusConsulta } from '../models';
import { buscarStatusSistemas } from '../data/mock-data';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StatusSistemasService {
  consultar(termo: string): Observable<SistemaStatusConsulta[]> {
    const resultado = buscarStatusSistemas(termo);
    if (environment.useMock) {
      return of(resultado).pipe(delay(400));
    }
    return of(resultado);
  }
}
