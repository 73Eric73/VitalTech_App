import { PlantaService } from './../../../../../../../libs/services/planta.service';
import { PlantaComponent } from './../../../../../../../libs/pages/Planta/planta.component';
import { NgModule } from '@angular/core';
import { PlantaRoutes } from './planta-routing.module';
import { RegistroPlantaComponent } from '../../../pages/inicio/pages/planta/pages/registro-planta/registro-planta.component';
import { ModifPlantaComponent } from '../../../pages/inicio/pages/planta/pages/modif-planta/modif-planta.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PlantaComponent,
    RegistroPlantaComponent,
    ModifPlantaComponent
  ],
  imports: [PlantaRoutes, SharedModule],
})
export class PlantaModule {}
