import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CamasService } from '../../../../../../service/camas.service';
import { camaidValidator, capacitatCamaHabitacion, codiLlitHabitacioValidator, habidValidator } from '../../../../../../validator/cama/cama-validator.validator';
import { HabitacioService } from '../../../../../../service/habitaciones.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro-cama',
  templateUrl: './registro-cama.component.html',
  styleUrl: './registro-cama.component.css'
})
export class RegistroCamaComponent {
  llitForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router, private route: ActivatedRoute,private llitService: CamasService, private habitacioService: HabitacioService){
    this.llitForm = this.fb.group({
      codiLlit: ['', {
        validators: [Validators.required, Validators.minLength(4), Validators.pattern(/^\d{3}[AB]$/)],
        asyncValidators: [camaidValidator(this.llitService)],
        updateOn: 'blur'
      }],
      habitacioId: ['', {
        validators: [Validators.required, Validators.pattern(/^\d{3}$/)],
        asyncValidators: [habidValidator(this.habitacioService)],
        updateOn: 'blur'
      }]
    }, {
      validator: [codiLlitHabitacioValidator()],

    });
  }

  onSubmit(){
    if(this.llitForm.invalid){
      this.llitForm.markAllAsTouched();
      return;
    }
    const llitData = this.llitForm.value;
    
    this.http.post('http://localhost:5296/api/Llit', llitData).subscribe(
      (response) => {
          console.log('Cama registrada exitosamente', response);
          Swal.fire({
              icon: 'success',
              title: 'Cama registrada',
              text: 'La cama se ha registrado correctamente.'
          });
      },
      (error) => {
          if (error.status === 400 && error.error === "No es poden afegir més llits a aquesta habitació.") {
              this.llitForm.setErrors({ limiteCapacidad: true });
          } else {
              console.error('Error en el registro de la cama:', error);
              Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'ERROR, campos no válidos.'
              });
          }
      }
  );
  }
}
    

    
