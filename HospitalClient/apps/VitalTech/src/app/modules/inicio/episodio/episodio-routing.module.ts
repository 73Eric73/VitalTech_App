import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EpisodisMedicsComponent } from '../../../../../../../libs/pages/Episodio/episodis-medics.component';
import { ModifEpisodiComponent } from '../../../pages/inicio/pages/episodio/pages/modif-episodio/modif-episodio.component';
import { RegistroEpisodiComponent } from '../../../pages/inicio/pages/episodio/pages/registro-episodio/registro-episodio.component';

const routes: Routes = [
  {
    path: '',
    component: EpisodisMedicsComponent,
  },
  {
    path: 'modif-episodio/:id',
    component: ModifEpisodiComponent,
  },
  {
    path: 'registro-episodio',
    component: RegistroEpisodiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EpisodioRout {}
