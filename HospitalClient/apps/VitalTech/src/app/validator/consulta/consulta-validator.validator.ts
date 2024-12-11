import { MedicoService } from './../../../../../../libs/services/metge.service';
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
import { EpisodiService } from '../../../../../../libs/services/episodis.service';

export function personalidValidator(
  personalService: MedicoService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return personalService.getById(control.value).pipe(
      map((personal) => (personal ? null : { personalNotFound: true })),
      catchError((error) => {
        return of({ personalNotFound: true });
      })
    );
  };
}

export function episodiidValidator(
  episodiService: EpisodiService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return episodiService.getById(control.value).pipe(
      map((episodi) => (episodi ? null : { episodiNotFound: true })),
      catchError((error) => {
        return of({ episodiNotFound: true });
      })
    );
  };
}

export function personalDniLetraCorrect(): ValidatorFn {
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
