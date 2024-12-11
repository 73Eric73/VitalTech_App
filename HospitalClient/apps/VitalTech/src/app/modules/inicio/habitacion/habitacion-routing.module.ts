import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ModifHabitacionComponent } from '../../../pages/inicio/pages/habitacion/pages/modif-habitacion/modif-habitacion.component';
import { RegistroHabitacionComponent } from '../../../pages/inicio/pages/habitacion/pages/registro-habitacion/registro-habitacion.component';
import { HabitacionesComponent } from '../../../../../../../libs/pages/Habitacion/habitaciones.component';

const routes: Routes = [
  {
    path: '',
    component: HabitacionesComponent,
  },
  {
    path: 'modif-habitacion/:id',
    component: ModifHabitacionComponent,
  },
  {
    path: 'registro-habitacion',
    component: RegistroHabitacionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HabitacionRoutes {}
