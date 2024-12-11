import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private router: Router) {}

  handleHttpError(error: any) {
    if (error.status === 401 || error.status === 403) {
      alert('Movida');
    }
    return throwError(() => error);
  }
}
