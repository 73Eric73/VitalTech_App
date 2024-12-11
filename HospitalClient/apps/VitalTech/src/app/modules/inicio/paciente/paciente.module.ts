import { PacientesComponent } from './../../../../../../../libs/pages/Paciente/pacientes.component';
import { NgModule } from '@angular/core'
import { PacienteRoutes } from './paciente-routing.module';
import { NavComponent } from '../../../components/nav/nav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ModifPacienteComponent } from '../../../pages/inicio/pages/paciente/pages/modif-paciente/modif-paciente.component';
import { RegistroComponent } from '../../../pages/inicio/pages/paciente/pages/registro-paciente/registro.component';

@NgModule({
  declarations: [PacientesComponent, RegistroComponent, ModifPacienteComponent],
  imports: [PacienteRoutes, SharedModule],
})
export class PacienteModule {}
