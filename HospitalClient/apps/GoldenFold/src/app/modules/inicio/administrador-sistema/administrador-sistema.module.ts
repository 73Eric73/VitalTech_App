import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministradorSistemaRoute } from './administrador-sistema-routing.module';
import { CamasComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/camas/camas.component';
import { HabitacionesComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/habitaciones/habitaciones.component';
import { PacientesComponent } from '../../../../../../../libs/pages/pacientes/pacientes.component';
// import { UsuariosComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/usuarios/usuarios.component';
import { IngresosComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/ingresos/ingresos.component';
import { PruebasComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/consultas/pruebas.component';
import { AdministradorSistemaDashboardComponent } from '../../../pages/inicio/pages/administrador-sistema/administrador-sistema-dashboard/administrador-sistema-dashboard.component';
import { SnackbarComponent } from '../../../components/snackbar/snackbar.component'; // Importar el componente standalone
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; // Módulo de tabla de Angular Material
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator'; // Módulo de paginación de Angular Material
import { MatSortModule, MatSort } from '@angular/material/sort'; // Módulo de ordenación de Angular Material
import { MatFormFieldModule } from '@angular/material/form-field'; // Para los campos de formulario
import { MatInputModule } from '@angular/material/input'; // Para los campos de entrada
import { MatButtonModule } from '@angular/material/button'; // Para los botones
import { MatOption, MatSelectModule } from '@angular/material/select'; // Para los selectores
import { SharedModule } from '../../shared/shared.module';
import { AdministradorSistemaComponent } from '../../../pages/inicio/pages/administrador-sistema/administrador-sistema.component';
import { PlantesComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/plantes/plantes.component';
import { MetgesComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/metges/metges.component';
import { EpisodisMedicsComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/episodis-medics/episodis-medics.component';
import { EnfermersComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/enfermers/enfermers.component';
import { AdministradoresSistemaComponent } from '../../../pages/inicio/pages/administrador-sistema/pages/administradores-sistema/administradores-sistema.component';

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
    PlantesComponent,
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
