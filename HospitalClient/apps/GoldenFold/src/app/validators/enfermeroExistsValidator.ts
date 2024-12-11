import { EnfermeroService } from './../../../../../libs/services/enfermero.service';
import { MedicoService } from './../../../../../libs/services/metge.service';
// username-async-validator.ts
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EnfermeroAsyncValidator {
  constructor(private enfermeroService: EnfermeroService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null); // No hay validación si no hay nada que validar
    }
    return this.enfermeroService.getAll().pipe(
      map((enfermeros) => {
        const usernameExists = enfermeros.some(
          (enfermero) => enfermero.usuariId === control.value
        );

        return usernameExists ? { usernameTaken: true } : null;
      }),
      catchError(() => of(null))
    );
  }
}
