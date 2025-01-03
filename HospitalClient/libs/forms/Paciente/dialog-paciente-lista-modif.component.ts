import { PacienteService } from './../../services/paciente.service';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Paciente } from '../../interfaces/paciente.interface';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { formatDate } from '@angular/common'; // Import formatDate for date formatting
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CustomDateAdapter } from '../../../apps/GoldenFold/src/app/custom-date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Nacionalidad } from '../../enums/nacionalidades';
import { obtenerUsuariosDisponibles } from '../../utils/utilFunctions';
import { Usuari } from '../../interfaces/usuari.interface';
import { UsuarioService } from '../../services/usuario.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-dialog-paciente-lista-modif',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule, // Necessary for ngModel
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatDialogModule,
    CommonModule,
    MatButtonModule, // For "Cancel" and "Save" buttons
    MatDatepickerModule, // Importing MatDatepickerModule for date picker
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './dialog-paciente-lista-modif.component.html',
  styleUrls: [],
})
export class DialogPacienteComponent {

  pacienteForm!: FormGroup;
  isEditing: boolean = true;
  usuarios!: Usuari[];
  cssPaths!: string[];
  pacientes!:Paciente[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Paciente,
    private pacienteService: PacienteService,
    public dialogRef: MatDialogRef<DialogPacienteComponent>,
    private fb: FormBuilder
  ) {

    this.cssPaths =  ['/assets/styles/styles.css','/assets/styles/pacientes/popups/dialog-formulario-paciente.component.css'];
    this.cssPaths.forEach(css => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = css;
      document.head.appendChild(link);
    });

    this.obtenerPacietes(); //obtener administradores de sistema
    this.crearFormularioPaciente(); //crear formulario reactivo
    if (this.data.dni) {
      this.showDetails();
    }

  }

  get isReadOnly(): boolean {
    return !this.isEditing;
  }

  // Función para habilitar el modo edición
  enableEditing(): void {
    this.isEditing = true;
    this.pacienteForm.enable();
  }

  // Función para mostrar detalles (solo lectura)
  showDetails(): void {
    this.isEditing = false;
    this.pacienteForm.disable();
  }

  // Función para cancelar
  cancelar(): void {
    this.dialogRef.close();
  }

  crearFormularioPaciente(): void {
    this.pacienteForm = this.fb.group({
      dni: [
        this.data.dni,
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ], // Example validation for DNI
      numSS: [this.data.numSS, Validators.required],
      nom: [this.data.nom, Validators.required],
      cognom1: [this.data.cognom1, Validators.required],
      cognom2: [this.data.cognom2],
      sexe: [this.data.sexe, Validators.required],
      telefono: [
        this.data.telefono,
        [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]{9,20}$/)],
      ],
      nacionalidad: [this.data.nacionalidad, Validators.required],
      email: [
        this.data.email,
        [
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      birthDay: [
        this.data.birthDay ? new Date(this.data.birthDay) : null,
        Validators.required,
      ], // Ensure date object is set
    });
  }

  obtenerPacietes(): void {
      this.pacienteService.getAll().subscribe({
        next:(data: Paciente[]) =>{
          this.pacientes = data;
        },
        error:(error:any)=>{
          console.log('ERROR',error);
        }
      })
    }

  guardar(): void {
    if (this.pacienteForm.valid) {
      const formData = this.pacienteForm.value;
      
      // Format the birthDay before closing the dialog
      formData.birthDay = formatDate(formData.birthDay, 'yyyy-MM-dd', 'en');
      if (formData.sexe = "Femenino") formData.sexe = "F";
      if (formData.sexe = "Masculino") formData.sexe = "M";


      this.dialogRef.close(formData);
    }
  }
}


