import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PacientService } from '../../../../../../service/pacientes.service';
import { Pacient } from '../../../../../../interface/pacient.interface';
import Swal from 'sweetalert2';
import { pacienteDniLetraCorrect, pacienteDniValidatorModif, pacienteSSValidator } from '../../../../../../validator/paciente/paciente-validator.validator';

@Component({
  selector: 'app-registro',
  templateUrl: './modif-paciente.component.html',
  styleUrl: './modif-paciente.component.css'
})

export class ModifPacienteComponent {

  modiPacientForm: FormGroup;
  pacientId: string = "";
  originalDni: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private pacientService: PacientService,private router: Router, private route: ActivatedRoute) {
    const dniId = this.route.snapshot.paramMap.get('id') || '';
    this.originalDni = dniId;

    this.modiPacientForm = this.fb.group({
      dni: ['', {
        validators: [Validators.required, Validators.minLength(9), Validators.pattern(/^\d{8}[A-Za-z]$/)],
        asyncValidators: [pacienteDniValidatorModif(this.pacientService, this.originalDni)],
        updateOn: 'blur'
      }],
      numSS: ['', {
        validators: [Validators.required, Validators.maxLength(15), Validators.minLength(15), Validators.pattern(/^[A-Z]{4}\d{10}$/)],
        asyncValidators: [pacienteSSValidator(this.pacientService)],
        updateOn: 'blur'
      }],
      nom: ['', {
        validators: [Validators.required]
      }],
      sexe: ['', {
        validators:[Validators.required]
      }]
    }, {
      validators: pacienteDniLetraCorrect()
    });
  }

  ngOnInit(): void {
    this.pacientId = String(this.route.snapshot.paramMap.get('id')); 
    this.pacientService.getPacientId(this.pacientId).subscribe(pacient => {
      this.modiPacientForm.patchValue(pacient);
    })
  }

  onUpdate(): void {

    
      const updatedPacient: Pacient = { ...this.modiPacientForm.getRawValue(), dni: this.pacientId };
      this.pacientService.putPacient(updatedPacient).subscribe({

        next: response => {
          Swal.fire({
            icon: 'success',
            title: 'Paciente modificado',
            text: 'El paciente se ha modificado correctamente.'
          });
        },
        error: error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ERROR, campos no válidos.'
          });
        }

        // next:() => {
        //   alert('Pacient actualizat amb exit');
        //   this.router.navigate(['/pacientes']);
        // },
        // error: (error) => {
        //   console.error('Error al actualitzar el pacient:', error);
        //   alert('Error al actualitzar el paciente');
        // }
      })

    }
  

}
