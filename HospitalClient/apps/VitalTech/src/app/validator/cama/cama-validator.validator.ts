import {
  AbstractControl,
  ValidatorFn,
  AsyncValidatorFn,
  ValidationErrors,
  FormGroup,
  Form,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CamaService } from '../../../../../../libs/services/cama.service';
import { HabitacionService } from '../../../../../../libs/services/habitacion.service';
import { PacienteService } from '../../../../../../libs/services/paciente.service';
import { IngresoService } from '../../../../../../libs/services/ingreso.service';

export function camaidValidator(camasService: CamaService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return camasService.getById(control.value).pipe(
      map((llit) => (llit ? { camaIdExists: true } : null)),
      catchError(() => of(null))
    );
  };
}
export function habidValidator(
  habitacionService: HabitacionService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    const id = +control.value;

    return habitacionService.getById(id).pipe(
      map((habitacion) => (habitacion ? null : { habitacionIdNotFound: true })),
      catchError((error) => {
        return of({ habitacionIdNotFound: true });
      })
    );
  };
}

export function codiLlitHabitacioValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;

    const codillit = formGroup.get('codiLlit')?.value;
    const habitacioId = formGroup.get('habitacioId')?.value;

    if (!codillit || !habitacioId) {
      return of(null);
    }

    const codiLlitPrefix = codillit.substring(0, 3);

    if (codiLlitPrefix == habitacioId.toString()) {
      return null;
    } else {
      return { codiLlitHabitacioMismatch: true };
    }
  };
}

export function camaIdValidatorModif(
  camasService: CamaService,
  originalId: string | null = null
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value === originalId) {
      return of(null);
    }

    return camasService.getById(control.value).pipe(
      map((llit) => (llit ? { camaIdExists: true } : null)),
      catchError(() => of(null))
    );
  };
}

export function camaOcupadaPaciente(
  ingresoService: IngresoService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const formGroup = control as FormGroup;

    const foraDeServei = formGroup.get('foraDeServei')?.value;
    const codiLlit = formGroup.get('codiLlit')?.value;

    console.log('Validador camaOcupadaPaciente ejecutado con:', {
      foraDeServei,
      codiLlit,
    });

    // Verifica si `foraDeServei` es verdadero y si `codiLlit` está presente
    if (foraDeServei !== true || !codiLlit) {
      return of(null);
    }

    return ingresoService.getAll().pipe(
      map((ingresos) => {
        const ingresosRelacionados = ingresos.filter(
          (ingreso) => ingreso.codiLlit === codiLlit
        );
        const error =
          ingresosRelacionados.length > 0
            ? { camaOcupadaPaciente: true }
            : null;
        console.log('Resultado del validador: ', error);
        return error;
      }),
      catchError((err) => {
        console.error('Error en camaOcupadaPaciente: ', err);
        return of(null);
      })
    );
  };
}
