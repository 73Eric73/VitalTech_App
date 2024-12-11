import { NgModule } from '@angular/core';
import { HabitacionRoutes } from './habitacion-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { RegistroHabitacionComponent } from '../../../pages/inicio/pages/habitacion/pages/registro-habitacion/registro-habitacion.component';
import { ModifHabitacionComponent } from '../../../pages/inicio/pages/habitacion/pages/modif-habitacion/modif-habitacion.component';
import { HabitacionesComponent } from '../../../../../../../libs/pages/Habitacion/habitaciones.component';

@NgModule({
  declarations: [
    HabitacionesComponent,
    RegistroHabitacionComponent,
    ModifHabitacionComponent,
  ],
  imports: [HabitacionRoutes, SharedModule],
})
export class HabitacionModule {}
