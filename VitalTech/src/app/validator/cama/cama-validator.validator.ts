import { AbstractControl, ValidatorFn, AsyncValidatorFn, ValidationErrors, FormGroup, Form } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CamasService } from '../../service/camas.service';
import { HabitacioService } from '../../service/habitaciones.service';
import { PacientService } from '../../service/pacientes.service';
import { IngresService } from '../../service/ingres.service';


export function camaidValidator(camasService: CamasService): AsyncValidatorFn{
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) {
          return of(null); 
        }

        return camasService.getLlit(control.value).pipe(
            map(llit => (llit ? { camaIdExists: true } : null)), 
            catchError(() => of(null)) 
        );
    };
    
}
export function habidValidator(habitacionService: HabitacioService): AsyncValidatorFn{
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) {
          return of(null); 
        }

        const id = +control.value;

        return habitacionService.getHabitacio(id).pipe(
            map(habitacion => (
                 habitacion ? null : { habitacionIdNotFound: true }
            )),
            catchError( error => {
                return of({ habitacionIdNotFound: true });
            }

        ));
    };
}

export function codiLlitHabitacioValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const formGroup = control as FormGroup;
        
        const codillit = formGroup.get('codiLlit')?.value;
        const habitacioId = formGroup.get('habitacioId')?.value;


        if(!codillit || !habitacioId){
            return of(null);
        }


        const codiLlitPrefix = codillit.substring(0,3);

        if (codiLlitPrefix == habitacioId.toString()) {
            return null;
        } else {
            return { codiLlitHabitacioMismatch: true };
        }
    }
}

export function camaIdValidatorModif(camasService: CamasService, originalId: string | null = null): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value || control.value === originalId){
            return of(null);
        }

        return camasService.getLlit(control.value).pipe(
            map(llit => (llit? {camaIdExists: true} : null)),
            catchError(() => of(null))
        );
    };
}

export function camaOcupadaPaciente(ingresoService: IngresService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const formGroup = control as FormGroup;
  
      const foraDeServei = formGroup.get('foraDeServei')?.value;
      const codiLlit = formGroup.get('codiLlit')?.value;
  
      console.log('Validador camaOcupadaPaciente ejecutado con:', { foraDeServei, codiLlit });
  
      // Verifica si `foraDeServei` es verdadero y si `codiLlit` está presente
      if (foraDeServei !== true || !codiLlit) {
        return of(null);
      }
  
      return ingresoService.getIngressos().pipe(
        map(ingresos => {
          const ingresosRelacionados = ingresos.filter(ingreso => ingreso.codiLlit === codiLlit);
          const error = ingresosRelacionados.length > 0 ? { camaOcupadaPaciente: true } : null;
          console.log('Resultado del validador: ', error);
          return error;
        }),
        catchError(err => {
          console.error('Error en camaOcupadaPaciente: ', err);
          return of(null);
        })
      );
    };
  }




