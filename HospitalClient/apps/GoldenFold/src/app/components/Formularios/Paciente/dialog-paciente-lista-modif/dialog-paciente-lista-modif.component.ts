import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Paciente } from '../../../../../../../../libs/interfaces/paciente.interface';
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
import { CustomDateAdapter } from '../../../../custom-date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Nacionalidad } from '../../../../enums/nacionalidades';

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
  styleUrls: ['./dialog-paciente-lista-modif.component.css'],
})
export class DialogPacienteComponent {
  pacienteForm!: FormGroup;
  editar: boolean = false;
  nacionalidades = Object.entries(Nacionalidad)
    .filter(([key, value]) => !isNaN(Number(value))) // Filtra solo las entradas numéricas
    .map(([key, value]) => ({ id: value as number, nombre: key })); // Mapea a un objeto con id y nombre

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Paciente,
    public dialogRef: MatDialogRef<DialogPacienteComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.crearFormularioPaciente();
    this.showDetails();
  }

  get isReadOnly(): boolean {
    return !this.editar;
  }

  enableEditing(): void {
    this.editar = true;
    this.pacienteForm.enable();
  }

  showDetails(): void {
    this.editar = false;
    this.pacienteForm.disable();
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
      administratiuId: [this.data.administratiuId],
      birthDay: [
        this.data.birthDay ? new Date(this.data.birthDay) : null,
        Validators.required,
      ], // Ensure date object is set
    });
  }

  guardar(): void {
    if (this.pacienteForm.valid) {
      const formData = this.pacienteForm.value;

      // Format the birthDay before closing the dialog
      formData.birthDay = formatDate(formData.birthDay, 'yyyy-MM-dd', 'en');

      this.dialogRef.close(formData);
    }
  }
}
