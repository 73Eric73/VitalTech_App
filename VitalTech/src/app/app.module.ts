import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component'; 
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule, JwtInterceptor } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from './modules/shared/shared.module';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppKeycloakService } from './keycloak.service';

export function tokenGetter() {
  return localStorage.getItem('token');
}
export function initializeKeycloak(appKeycloak: AppKeycloakService) {
  return () => appKeycloak.init();
}
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
    KeycloakAngularModule,
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
    AppKeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [AppKeycloakService],
    }
  
  ],
  bootstrap: [LoginComponent] 
})
export class AppModule { }
