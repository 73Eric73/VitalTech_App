import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-planta',
  templateUrl: './registro-planta.component.html',
  styleUrl: './registro-planta.component.css'
})
export class RegistroPlantaComponent {
  plantaForm: FormGroup;


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router){
    this.plantaForm = this.fb.group({
      capacitatHabitacions: ['', {
        validators: [Validators.pattern(/^(?:[0-9]|[1-6][0-9]|70)$/)]
      }],
    });
  }


  onSubmit(){
    
    if(this.plantaForm.invalid){
      this.plantaForm.markAllAsTouched();
      return;
    }
    const plantaData = this.plantaForm.value;
    if (plantaData.capacitatHabitacions === null || plantaData.capacitatHabitacions === ''){
      plantaData.capacitatHabitacions = 0;
    }
    
    this.http.post('http://localhost:5296/api/Planta', plantaData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          title: 'Planta registrada',
          text: 'La planta se ha registrado correctamente.'
        });
      },
      error: error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'ERROR, campos no válidos.'
        });
      }
    });

    // this.http.post('http://localhost:5296/api/Planta', plantaData).subscribe({
    //   next: response => console.log('Planta registrada:', response),
    //   error: error => alert('ERROR, camps no valids'),
    //   complete: () => alert('Operacio completada')
    // })
  }
}
