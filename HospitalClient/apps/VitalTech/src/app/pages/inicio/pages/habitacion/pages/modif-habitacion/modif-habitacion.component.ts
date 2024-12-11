import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HabitacionService } from '../../../../../../../../../../libs/services/habitacion.service';
import { Habitacion } from '../../../../../../../../../../libs/interfaces/habitacion.interface';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  codiHabitacioPlantaValidator,
  plantaidValidator,
  habidValidatorModif,
} from '../../../../../../validator/habitacion/habitacion-validator.validator';
import { PlantaService } from '../../../../../../../../../../libs/services/planta.service';

@Component({
  selector: 'app-modif-habitacion',
  templateUrl: './modif-habitacion.component.html',
  styleUrl: './modif-habitacion.component.css',
})
export class ModifHabitacionComponent {
  habitacionForm: FormGroup;
  habitacioId: number = 0;

  constructor(
    private habService: HabitacionService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private plantaService: PlantaService
  ) {
    this.habitacionForm = this.fb.group(
      {
        codiHabitacio: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(3),
              Validators.pattern(/^\d{3}$/),
            ],
          },
        ],
        capacitatLlits: [
          '',
          {
            validators: [Validators.required, Validators.pattern(/^[12]$/)],
          },
        ],
        plantaId: [
          '',
          {
            validators: [Validators.required, Validators.pattern(/^\d$/)],
            asyncValidators: [plantaidValidator(this.plantaService)],
          },
        ],
      },
      {
        validator: [codiHabitacioPlantaValidator()],
      }
    );
  }

  ngOnInit() {
    this.habitacioId = Number(this.route.snapshot.paramMap.get('id')); // obtiene el id de la consulta desde la url
    this.habService.getById(this.habitacioId).subscribe((habitacio) => {
      this.habitacionForm.patchValue(habitacio);
    });
  }

  onAtras() {
    this.router.navigate(['/inicio/habitacion']);
  }

  onSubmit() {
    if (this.habitacionForm.invalid) {
      this.habitacionForm.markAllAsTouched();
      return;
    }
    if (this.habitacionForm.valid) {
      const updateHabitacion: Habitacion = {
        ...this.habitacionForm.getRawValue(),
        id: this.habitacioId,
      };
      this.habService.put(updateHabitacion.codiHabitacio,updateHabitacion).subscribe({
        // next:() => {
        //   alert('Habitación actualitzada amb exit');
        //   this.router.navigate(['/habitacion']);
        // },
        // error: (error) => {
        //   console.error('Error al actualitzar la habitación:', error);
        //   alert('Error al actualitzar la habitación');
        // }

        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Habitación modificada',
            text: 'La habitación se ha modificado correctamente.',
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ERROR, campos no válidos.',
          });
        },
      });
    }
  }
}
