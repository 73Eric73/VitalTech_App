import { PlantaService } from './../../../../../../../../../../libs/services/planta.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planta } from '../../../../../../../../../../libs/interfaces/planta.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modif-planta',
  templateUrl: './modif-planta.component.html',
  styleUrl: './modif-planta.component.css',
})
export class ModifPlantaComponent {
  plantaForm: FormGroup;
  plantaId: number = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private plantaService: PlantaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.plantaForm = this.fb.group({
      piso: [{ value: '', disabled: false }],
      capacitatHabitacions: [
        '',
        {
          validators: [Validators.pattern(/^(?:[0-9]|[1-6][0-9]|70)$/)],
        },
      ],
    });
  }

  onAtras() {
    this.router.navigate(['/inicio/planta']);
  }

  ngOnInit(): void {
    this.plantaId = Number(this.route.snapshot.paramMap.get('piso')); // obtiene el id de la planta desde la url
    this.plantaService.getById(this.plantaId).subscribe((planta) => {
      this.plantaForm.patchValue(planta);
    });
  }

  onActualice(): void {
    this.plantaId = Number(this.route.snapshot.paramMap.get('piso'));
    console.log(this.plantaId);
    if (this.plantaForm.invalid) {
      this.plantaForm.markAllAsTouched();
      return;
    }
    if (this.plantaForm.valid) {
      const updatedLlit: Planta = {
        ...this.plantaForm.getRawValue(),
        id: this.plantaId,
      };
      console.log(this.plantaId);
      if (
        updatedLlit.capacitatHabitacions === null ||
        updatedLlit.capacitatHabitacions.toString() === ''
      ) {
        updatedLlit.capacitatHabitacions = 0;
      }
      this.plantaService.put(updatedLlit.piso, updatedLlit).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Planta modificada',
            text: 'La planta se ha modificado correctamente.',
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Campos no válidos.',
          });
        },

        // next:() => {
        //   alert('Planta actualitzada amb exit');
        //   this.router.navigate(['/planta']);
        // },
        // error: (error) => {
        //   console.error('Error al actualitzar la planta:', error);
        //   alert('Error al actualitzar la planta');
        // }
      });
    }
  }
}
