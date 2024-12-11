import { PlantaService } from './../../../../../../libs/services/planta.service';
import { HabitacionService } from './../../../../../../libs/services/habitacion.service';
import {
  AbstractControl,
  ValidatorFn,
  AsyncValidatorFn,
  ValidationErrors,
  FormGroup,
  Form,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export function habidValidator(
  habitacionService: HabitacionService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return habitacionService.getById(control.value).pipe(
      map((hab) => (hab ? { habIdExists: true } : null)),
      catchError(() => of(null))
    );
  };
}

export function habidValidatorModif(
  habitacionService: HabitacionService,
  originalHabitacionId: number | null = null
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // Si el campo está vacío o coincide con el código original, no hacemos validación
    if (!control.value || control.value === originalHabitacionId) {
      return of(null); // Validación exitosa, no hay error
    }

    // Si no es el mismo valor, hacemos la validación llamando al servicio
    return habitacionService.getById(control.value).pipe(
      map((hab) => (hab ? { habIdExists: true } : null)), // Si existe la habitación, devuelve error
      catchError(() => of(null)) // Si hay un error en la llamada, asumimos que no existe
    );
  };
}

export function plantaidValidator(
  plantaService: PlantaService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    const id = +control.value;

    return plantaService.getById(id).pipe(
      map((planta) => (planta ? null : { plantaIdNotFound: true })),
      catchError((error) => {
        return of({ plantaIdNotFound: true });
      })
    );
  };
}

export function codiHabitacioPlantaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;

    const habitacioId = formGroup.get('codiHabitacio')?.value;
    const plantaId = formGroup.get('plantaId')?.value;

    if (!plantaId || !habitacioId) {
      return of(null);
    }

    const codiHabPrefix = Number(habitacioId.toString().charAt(0));
    if (codiHabPrefix === plantaId) {
      return null;
    } else {
      return { codiHabitacioPlantaMismatch: true };
    }
  };
}
