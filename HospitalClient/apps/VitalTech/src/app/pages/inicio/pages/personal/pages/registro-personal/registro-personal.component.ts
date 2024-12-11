import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MedicoService } from '../../../../../../../../../../libs/services/metge.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-personal',
  templateUrl: './registro-personal.component.html',
  styleUrl: './registro-personal.component.css',
})
export class RegistroPersonalComponent {
  personalForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private personalService: MedicoService
  ) {
    this.personalForm = this.fb.group({
      dni: [''],
      nom: [''],
      telefon: [''],
      usuariId: [''],
      especialitat: [''],
    });
  }

  onSubmit() {
    const personalData = this.personalForm.value;

    this.personalService.post(personalData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Empleado registrado',
          text: 'El empleado se ha registrado correctamente.',
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

    // this.personalService.postPersonal(personalData).subscribe({
    //   next: response => alert('Personal creat'),
    //   error: error => alert('Error, camps no vàlids'),
    //   complete: () => alert('Operació completada'),
    // })
  }
}
