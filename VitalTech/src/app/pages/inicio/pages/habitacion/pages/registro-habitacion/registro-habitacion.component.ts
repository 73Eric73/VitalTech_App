import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HabitacioService } from '../../../../../../service/habitaciones.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { codiHabitacioPlantaValidator, plantaidValidator, habidValidator } from '../../../../../../validator/habitacion/habitacion-validator.validator';
import { PlantaService } from '../../../../../../service/planta.service';

@Component({
  selector: 'app-registro-habitacion',
  templateUrl: './registro-habitacion.component.html',
  styleUrl: './registro-habitacion.component.css'
})

export class RegistroHabitacionComponent {

  habitacionForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private habService: HabitacioService, private plantaService: PlantaService) {
    this.habitacionForm = this.fb.group({
      codiHabitacio: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.pattern(/^\d{3}$/)],
        asyncValidators: [habidValidator(this.habService)],
        
      }],
      capacitatLlits: ['', {
        validators: [Validators.required, Validators.pattern(/^[12]$/)]
      }],
      plantaId:['', {
        validators: [Validators.required, Validators.pattern(/^\d{1}$/)],
        asyncValidators: [plantaidValidator(this.plantaService)],
      }]
    }, {
      validator: codiHabitacioPlantaValidator()
    });
  }

  onSubmit() {
    if(this.habitacionForm.invalid){
      this.habitacionForm.markAllAsTouched();
      return;
    }
    const habitacionData = this.habitacionForm.value;

  //   this.habService.postHabitacio(habitacionData).subscribe({
  //     next: response => alert('Habitació creada'),
  //     error: error => alert('Error, camps no vàlids'),
  //     complete: () => alert('Operació completada'),
  // });

  this.http.post('http://localhost:5296/api/habitacio', habitacionData).subscribe(
    (response) => {
      Swal.fire({
        icon: 'success',
        title: 'Habitación registrada',
        text: 'La habitación se ha registrado correctamente.'
      });
    },
    (error) => {
      if(error.status === 400 && error.error === "No es poden agregar més habitacions a aquesta planta."){
        this.habitacionForm.setErrors({limiteCapacidad: true});
      } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ERROR, campos no válidos.'
      });
    }
    }
  )
  }
}