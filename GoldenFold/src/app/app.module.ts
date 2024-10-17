import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { KeycloakAngularModule } from 'keycloak-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './modules/shared/shared.module';  // Importa el SharedModule
import { InicioComponent } from './pages/inicio/inicio.component';
//import { PlantesComponent } from './pages/inicio/pages/administrador-sistema/pages/plantes/plantes.component';

@NgModule({
  declarations: [
    //PlantesComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    KeycloakAngularModule,
    BrowserAnimationsModule,
    SharedModule  // Asegúrate de incluir el SharedModule aquí
  ],
  providers: [],
  bootstrap: [InicioComponent]  // Asegúrate de hacer bootstrap AppComponent
})
export class AppModule { }
