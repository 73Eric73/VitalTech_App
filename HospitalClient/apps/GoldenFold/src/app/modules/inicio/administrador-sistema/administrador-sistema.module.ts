import { PlantaComponent } from './../../../../../../../libs/pages/Planta/planta.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministradorSistemaRoute } from './administrador-sistema-routing.module';
import { CamasComponent } from '../../../../../../../libs/pages/Cama/camas.component';
import { HabitacionesComponent } from '../../../../../../../libs/pages/Habitacion/habitaciones.component';
import { PacientesComponent } from '../../../../../../../libs/pages/Paciente/pacientes.component';
// import { UsuariosComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/usuarios/usuarios.component';
import { IngresosComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/ingresos/ingresos.component';
import { PruebasComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/consultas/pruebas.component';
import { AdministradorSistemaDashboardComponent } from '../../../pages/inicio/pages/administrador-sistema/administrador-sistema-dashboard/administrador-sistema-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { AdministradorSistemaComponent } from '../../../pages/inicio/pages/administrador-sistema/administrador-sistema.component';
import { EpisodisMedicsComponent } from '../../../../../../../libs/pages/Episodio/episodis-medics.component';
import { EnfermersComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/enfermers/enfermers.component';
import { AdministradoresSistemaComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/administradores-sistema/administradores-sistema.component';
import { MetgesComponent } from '../../../../../../../libs/pages/Medico/metges.component';

@NgModule({
  declarations: [
    AdministradorSistemaComponent,
    MetgesComponent,
    CamasComponent,
    AdministradoresSistemaComponent,
    EnfermersComponent,
    HabitacionesComponent,
    PacientesComponent,
  //  UsuariosComponent,
    IngresosComponent,
    PruebasComponent,
    PlantaComponent,
    EpisodisMedicsComponent,
  ],

  imports: [
    AdministradorSistemaRoute,
    AdministradorSistemaDashboardComponent,
    SharedModule,
    CommonModule,
  ],
})
export class AdministradorSistemaModule {}
