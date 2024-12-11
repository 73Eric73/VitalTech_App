import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MedicoService } from '../../../../../../../../../../libs/services/metge.service';
import {
  personalidValidator,
  episodiidValidator,
  personalDniLetraCorrect,
} from '../../../../../../validator/consulta/consulta-validator.validator';
import { EpisodiService } from '../../../../../../../../../../libs/services/episodis.service';

@Component({
  selector: 'app-registro-consulta',
  templateUrl: './registro-pruebas-diagnosticas.component.html',
  styleUrl: './registro-pruebas-diagnosticas.component.css',
})
export class RegistroConsultaComponent {
  consultaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private personalService: MedicoService,
    private episodiService: EpisodiService
  ) {
    this.consultaForm = this.fb.group(
      {
        urgencia: [''],
        sintomatologia: [
          '',
          {
            validators: [Validators.required],
          },
        ],
        recepta: [
          '',
          {
            validators: [Validators.required],
          },
        ],
        dniPersonal: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(9),
              Validators.pattern(/^\d{8}[A-Za-z]$/),
            ],
            asyncValidators: [personalidValidator(this.personalService)],
          },
        ],
        episodiMedicId: [
          '',
          {
            validators: [Validators.required],
            asyncValidators: [episodiidValidator(this.episodiService)],
          },
        ],
      },
      {
        validators: personalDniLetraCorrect(),
      }
    );
  }

  onSubmit() {
    if (this.consultaForm.invalid) {
      this.consultaForm.markAllAsTouched();
      return;
    }
    const consultaData = this.consultaForm.value;

    if (consultaData.urgencia === null || consultaData.urgencia === '') {
      consultaData.urgencia = false;
    }

    this.http
      .post('http://localhost:5296/api/Consulta', consultaData)
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Consulta registrada',
            text: 'La consulta se ha registrado correctamente.',
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
