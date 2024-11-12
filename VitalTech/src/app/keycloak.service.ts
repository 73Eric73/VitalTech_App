import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakInstance } from 'keycloak-js';

declare var Keycloak: any;

@Injectable({
  providedIn: 'root',
})
export class AppKeycloakService {
  constructor(private keycloakService: KeycloakService) {}

  init(): Promise<boolean> {
    return this.keycloakService.init({
      config: {
        url: 'http://localhost:8080/auth',
        realm: 'Dream Team',
        clientId: 'Vitaltech',
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: ['/assets'],
    });
  }
}
