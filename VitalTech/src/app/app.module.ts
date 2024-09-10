import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from '@auth0/angular-jwt';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaComponent } from './models/consulta/consulta.component';
import { ModifConsultaComponent } from './formularis/modif-consulta/modif-consulta.component';
import { PlantaComponent } from './models/planta/planta.component';
import { ModifPlantaComponent } from './formularis/modif-planta/modif-planta.component';
import { PacientesComponent } from './models/pacientes/pacientes.component';
import { ModifPacienteComponent } from './formularis/modif-paciente/modif-paciente.component';
import { ModifIngresComponent } from './formularis/modif-ingres/modif-ingres.component';
import { IngresComponent } from './models/ingres/ingres.component';
import { ModifLlitComponent } from './formularis/modif-llit/modif-llit.component';
import { CamasComponent } from './models/camas/camas.component';
import { EpisodisComponent } from './models/episodis/episodis.component';
import { ModifEpisodiComponent } from './formularis/modif-episodi/modif-episodi.component';
import { HabitacionesComponent } from './models/habitaciones/habitaciones.component';
import { ActualitzarHabitacionesComponent } from './formularis/actualitzar-habitaciones/actualitzar-habitaciones.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}
// estas rutas sirven para los put de cada modelo
const routes: Routes = [
  { path: 'consultas', component: ConsultaComponent },
  { path: 'modif-consulta/:id', component: ModifConsultaComponent },
  {path: 'modif-planta/:id', component: ModifPlantaComponent},
  {path: 'planta', component: PlantaComponent}

];
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5001"],
        disallowedRoutes: ["localhost:5001/api/auth"]
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],

})
export class AppModule { }
