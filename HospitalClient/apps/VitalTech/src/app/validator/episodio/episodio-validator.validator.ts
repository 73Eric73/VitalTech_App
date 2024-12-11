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
import { PacienteService } from '../../../../../../libs/services/paciente.service';

export function dataIniciFinalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;

    const dataObertura = formGroup.get('dataObertura')?.value;
    const dataTancament = formGroup.get('dataTancament')?.value;

    if (!dataObertura || !dataTancament) {
      return null;
    }

    if (new Date(dataObertura) > new Date(dataTancament)) {
      return { viatjeEnElTemps: true };
    } else if (new Date(dataObertura) > new Date()) {
      return { viatjeEnElTemps: true };
    } else {
      return null;
    }
  };
}
export function dataIniciValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;

    const dataObertura = formGroup.get('dataObertura')?.value;

    if (!dataObertura) {
      return null;
    }

    if (new Date(dataObertura) > new Date()) {
      return { viatjeEnElTemps: true };
    } else {
      return null;
    }
  };
}

export function pacientIdexists(
  pacientService: PacienteService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return pacientService.getById(control.value).pipe(
      map((paciente) => (paciente ? null : { pacienteIdNotFound: true })),
      catchError((error) => {
        return of({ pacienteIdNotFound: true });
      })
    );
  };
}

export function buit(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value || typeof value !== 'string') {
      return null;
    }

    if (value.trim().length === 0) {
      return { buit: 'No se puede poner solo espacios en blanco' };
    }

    return null;
  };
}
