import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PacienteService } from '../../../../../../../../../../libs/services/paciente.service';
import {
  pacienteDniValidator,
  pacienteDniLetraCorrect,
  pacienteSSValidator,
  pacienteSSLetrasNumValidators,
} from '../../../../../../validator/paciente/paciente-validator.validator';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  pacientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private pacientService: PacienteService
  ) {
    this.pacientForm = this.fb.group(
      {
        dni: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(9),
              Validators.pattern(/^\d{8}[A-Za-z]$/),
            ],
            asyncValidators: [pacienteDniValidator(this.pacientService)],
            updateOn: 'blur',
          },
        ],
        numSS: [
          '',
          {
            validators: [
              Validators.required,
              Validators.maxLength(14),
              Validators.minLength(14),
              Validators.pattern(/^[A-Z]{4}\d{10}$/),
            ],
            asyncValidators: [pacienteSSValidator(this.pacientService)],
            updateOn: 'blur',
          },
        ],
        nom: [
          '',
          {
            validators: [Validators.required],
            updateOn: 'blur',
          },
        ],
        cognom1: [
          '',
          {
            validators: [Validators.required],
            updateOn: 'blur',
          },
        ],
        cognom2: [
          '',
          {
            updateOn: 'blur',
          },
        ],
        sexe: [
          '',
          {
            validators: [Validators.required],
          },
        ],
        birthDay: [
          '',
          {
            validators: [Validators.required],
            updateOn: 'blur',
          },
        ],
      },
      {
        validator: [pacienteDniLetraCorrect(), pacienteSSLetrasNumValidators()],
      }
    );
  }

  onSubmit() {
    const pacienteData = this.pacientForm.value;

    this.http
      .post('http://localhost:5296/api/Pacient', pacienteData)
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Paciente registrado',
            text: 'El paciente se ha registrado correctamente.',
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
