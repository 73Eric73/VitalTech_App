import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Personal } from '../../../../../../../../libs/interfaces/personal.interface';
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
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

@Component({
  selector: 'app-dialog-formulario',
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

  templateUrl: './dialog-formulario-usuario.component.html',
  styleUrls: ['./dialog-formulario-usuario.component.css'],
})
export class DialogFormularioUsuarioComponent {
  personalForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Personal,
    public dialogRef: MatDialogRef<DialogFormularioUsuarioComponent>,
    private fb: FormBuilder
  ) {
    // Initialize the form with patient data and validations
    this.personalForm = this.fb.group({
      dni: [
        this.data.dni,
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ], // Example validation for DNI
      nom: [this.data.nom, Validators.required],
      especialitat: [this.data.especialitat, Validators.required],
    });
  }

  guardar(): void {
    if (this.personalForm.valid) {
      const formData = this.personalForm.value;
      this.dialogRef.close(formData);
    }
  }
}
