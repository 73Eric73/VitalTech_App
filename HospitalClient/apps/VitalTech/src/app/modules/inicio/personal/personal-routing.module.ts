import { MetgesComponent } from './../../../../../../../libs/pages/Medico/metges.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ModifPersonalComponent } from '../../../pages/inicio/pages/personal/pages/modif-personal/modif-personal.component';
import { RegistroPersonalComponent } from '../../../pages/inicio/pages/personal/pages/registro-personal/registro-personal.component';

const routes: Routes = [
  {
    path: '',
    component: MetgesComponent,
  },
  {
    path: 'modif-personal/:id',
    component: ModifPersonalComponent,
  },
  {
    path: 'registro-personal',
    component: RegistroPersonalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalRoutes {}
