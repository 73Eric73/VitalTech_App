import { UsuarioService } from './../../../../../libs/services/usuario.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';


export class UserValidators {
  // Validador asíncrono para nombre usuario
  //   static asyncFieldExisting(usuarioService: UsuarioService) {
  //     return (control: AbstractControl): Observable<ValidationErrors | null> => {
  //         return of(control.value).pipe(
  //             debounceTime(300),
  //             switchMap(value =>
  //                 usuarioService.getUsuarios(undefined, value, undefined).pipe(
  //                     map(usuarios => {
  //                         //Filtrar los usuarios en el frontend
  //                         const usuariosFiltrados = usuarios.filter(usuario =>
  //                             usuario.NombreUsuario==value
  //                         );

  //                         if (usuariosFiltrados.length > 0) {
  //                             return { asyncFieldExisting: true };
  //                         }
  //                         return null;
  //                     }),
  //                     catchError(() => of(null))
  //                 )
  //             )
  //         );
  //     };
  // }

  static noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    };
  }
}
