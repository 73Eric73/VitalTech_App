import { EnfermersComponent } from './../../../../../../../libs/pages/Enfermero/enfermers.component';
import { AdministradoresSistemaComponent } from './../../../../../../../libs/pages/AdministradorSistema/administradores-sistema.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamasComponent } from '../../../../../../../libs/pages/Cama/camas.component';
import { HabitacionesComponent } from '../../../../../../../libs/pages/Habitacion/habitaciones.component';
import { PacientesComponent } from '../../../../../../../libs/pages/pacientes/pacientes.component';
import { UsuarioComponent } from '../../../../../../../libs/pages/Usuario/usuario.component';
import { AdministradorSistemaComponent } from '../../../pages/inicio/pages/administrador-sistema/administrador-sistema.component';
import { PlantaComponent } from '../../../../../../../libs/pages/Planta/planta.component';
import { MetgesComponent } from '../../../../../../../libs/pages/Medico/metges.component';
import { PruebasComponent } from '../../../../../../../libs/pages/Pruebas-diagnosticas/pruebas.component';
import { EpisodiComponent } from '../../../../../../../libs/pages/Episodio/episodio-medico.component';
import {IngresosComponent} from '../../../../../../../libs/pages/Ingreso/ingresos.component'

const routes: Routes = [
  {
    path: '',
    component: AdministradorSistemaComponent,
  },
  {
    path: 'camas',
    component: CamasComponent,
  },
  {
    path: 'episodio-medico',
    component: EpisodiComponent,
  },

  {
    path: 'habitaciones',
    component: HabitacionesComponent,
  },
  {
    path: 'pacientes',
    component: PacientesComponent,
  },
  {
    path: 'usuario',
    component: UsuarioComponent,
   },
  {
    path: 'ingresos',
    component: IngresosComponent,
  },
  {
    path: 'pruebas',
    component: PruebasComponent,
  },
  {
    path: 'planta',
    component: PlantaComponent,
  },
  {
    path: 'metges',
    component: MetgesComponent,
  },
  {
    path: 'enfermers',
    component: EnfermersComponent,
  },
  {
    path: 'administradores-sistema',
    component: AdministradoresSistemaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorSistemaRoute {}
