import { PacientesComponent } from './../../../../../../../libs/pages/Paciente/pacientes.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ModifPacienteComponent } from '../../../pages/inicio/pages/paciente/pages/modif-paciente/modif-paciente.component';
import { RegistroComponent } from '../../../pages/inicio/pages/paciente/pages/registro-paciente/registro.component';

const routes: Routes = [
  {
    path: '',
    component: PacientesComponent,
  },
  {
    path: 'modif-paciente/:id',
    component: ModifPacienteComponent,
  },
  {
    path: 'registro',
    component: RegistroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PacienteRoutes {}
