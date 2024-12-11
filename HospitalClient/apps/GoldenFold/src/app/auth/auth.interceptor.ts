import { ErrorHandlerService } from './../../../../../libs/services/handle-error.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError, from } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oidcSecurityService = inject(OidcSecurityService);
  const errorHandlerService = inject(ErrorHandlerService);

  return from(oidcSecurityService.getAccessToken()).pipe(
    switchMap((token) => {
      const authReq = token
        ? req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          })
        : req;

      return next(authReq).pipe(
        catchError((error) => errorHandlerService.handleHttpError(error))
      );
    })
  );
};
