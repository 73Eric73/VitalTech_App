import { PacienteService } from './../../../../../../libs/services/paciente.service';
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

export function pacienteDniValidator(
  pacienteService: PacienteService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return pacienteService.getById(control.value).pipe(
      map((pacient) => (pacient ? { pacientIdExists: true } : null)),
      catchError(() => of(null))
    );
  };
}
export function pacienteDniLetraCorrect(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;

    const dni = formGroup.get('dni')?.value;

    if (!dni) {
      return null;
    }
    const abc: string[] = [
      'T',
      'R',
      'W',
      'A',
      'G',
      'M',
      'Y',
      'F',
      'P',
      'D',
      'X',
      'B',
      'N',
      'J',
      'Z',
      'S',
      'Q',
      'V',
      'H',
      'L',
      'C',
      'K',
      'E',
    ];
    const numDni = Number(dni.substring(0, 8));
    const letra = dni.substring(dni.length - 1).toUpperCase();

    const resto = numDni % 23;
    const letraCorrecta = abc[resto];

    if (letra === letraCorrecta) {
      return null;
    } else {
      return { dniLletraIncorrect: true };
    }
  };
}

export function pacienteSSLetrasNumValidators(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;

    const SS = formGroup.get('numSS')?.value;
    const apellido1 = formGroup.get('cognom1')?.value;
    const apellido2 = formGroup.get('cognom2')?.value;

    if (!SS || !apellido1 || !apellido2) {
      return of(null);
    }

    const regex = /^[A-Z]{4}[01][0-9]{6}00[0-9]$/;

    if (regex.test(SS)) {
      const a1 = SS.substring(0, 2).toUpperCase();
      const a2 = SS.substring(2, 4).toUpperCase();

      let firstApellido2;

      if (apellido2) {
        firstApellido2 =
          apellido2.length > 2 ? apellido2.substring(0, 2).toUpperCase() : '';
      } else {
        firstApellido2 =
          apellido1.length > 2 ? apellido1.substring(0, 2).toUpperCase() : '';
      }

      const fisrtApellido =
        apellido1.length > 2 ? apellido1.substring(0, 2).toUpperCase() : '';

      console.log(a1 + ' ' + a2 + ' ' + fisrtApellido + ' ' + firstApellido2);

      if (fisrtApellido === a1 && firstApellido2 === a2) {
        return of(null);
      }
    }

    return { SSLletraIncorrect: true };
  };
}
export function pacienteSSValidator(
  pacienteService: PacienteService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return pacienteService.getAll().pipe(
      map((pacients) => {
        const pacient = pacients.find((p) => p.numSS === control.value);
        return pacient ? { pacientSSExistes: true } : null;
      }),
      catchError(() => of(null))
    );
  };
}
export function pacienteDniValidatorModif(
  pacienteService: PacienteService,
  dniOriginal: string
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value === dniOriginal) {
      return of(null);
    }

    return pacienteService.getById(control.value).pipe(
      map((pacient) => (pacient ? { pacientIdExistes: true } : null)),
      catchError(() => of(null))
    );
  };
}
