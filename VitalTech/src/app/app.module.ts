import { NgModule, ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component'; 
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi  } from '@angular/common/http';
import { JwtModule, JwtInterceptor } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from './modules/shared/shared.module';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';
import { initKeycloak } from './keycloak-init.factory';

export function tokenGetter() {
  return localStorage.getItem('token');
}


export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    },
    KeycloakService,
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync()
  ]
};

@NgModule({
  declarations: [
    LoginComponent, 

  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5001"],
        disallowedRoutes: ["localhost:5001/api/auth"]
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ...appConfig.providers  // Agregamos los providers de appConfig
  ],
  bootstrap: [LoginComponent] 
})
export class AppModule { }
