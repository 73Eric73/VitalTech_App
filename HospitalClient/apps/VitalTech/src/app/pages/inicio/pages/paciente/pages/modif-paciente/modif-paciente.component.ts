import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../../../../../../../../../libs/services/paciente.service';
import { Paciente } from '../../../../../../../../../../libs/interfaces/paciente.interface';
import Swal from 'sweetalert2';
import {
  pacienteDniLetraCorrect,
  pacienteDniValidatorModif,
  pacienteSSValidator,
} from '../../../../../../validator/paciente/paciente-validator.validator';

@Component({
  selector: 'app-registro',
  templateUrl: './modif-paciente.component.html',
  styleUrl: './modif-paciente.component.css',
})
export class ModifPacienteComponent {
  modiPacientForm: FormGroup;
  pacientId: string = '';
  originalDni: string | null = null;
  dniSuperOriginal: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private pacientService: PacienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const dniId = this.route.snapshot.paramMap.get('id') || '';
    this.originalDni = dniId;

    this.modiPacientForm = this.fb.group(
      {
        dni: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(9),
              Validators.pattern(/^\d{8}[A-Za-z]$/),
            ],
            asyncValidators: [
              pacienteDniValidatorModif(this.pacientService, this.originalDni),
            ],
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
          },
        ],
        cognom1: [
          '',
          {
            validators: [Validators.required],
          },
        ],
        cognom2: [
          '',
          {
            validators: [Validators.required],
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
          },
        ],
      },
      {
        validators: pacienteDniLetraCorrect(),
      }
    );
  }

  ngOnInit(): void {
    this.pacientId = String(this.route.snapshot.paramMap.get('id'));
    this.pacientService.getById(this.pacientId).subscribe((pacient) => {
      pacient.birthDay = pacient.birthDay.split('T')[0];
      this.modiPacientForm.patchValue(pacient);
      this.dniSuperOriginal = pacient.dni;
    });
  }

  onUpdate(): void {
    const updatedPacient: Paciente = { ...this.modiPacientForm.getRawValue() };

    this.pacientService
      .put(this.dniSuperOriginal, updatedPacient)
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Paciente modificado',
            text: 'El paciente se ha modificado correctamente.',
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
