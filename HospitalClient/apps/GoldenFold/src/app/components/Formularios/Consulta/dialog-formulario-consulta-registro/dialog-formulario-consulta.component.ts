import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
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
import { PruebaDiagnostica } from '../../../../../../../../libs/interfaces/pruebas-diagnosticas.interface';
import { CustomDateAdapter } from '../../../../custom-date-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatOptionModule,
} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-dialog-formulario-consulta',
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
  templateUrl: './dialog-formulario-consulta.component.html',
  styleUrls: ['./dialog-formulario-consulta.component.css'],
})
export class DialogFormularioConsultaComponent {
  pruebaForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PruebaDiagnostica,
    public dialogRef: MatDialogRef<DialogFormularioConsultaComponent>,
    private fb: FormBuilder
  ) {
    this.pruebaForm = this.fb.group({
      dniMetge: [this.data.dniMetge, [Validators.required]],
      dniEnfermer: [this.data.dniEnfermer, [Validators.required]],
      episodiMedicId: [this.data.episodiMedicId, [Validators.required]],
      dolencia: [this.data.dolencia, [Validators.required]],
      pruebas: [this.data.pruebas],
      resultados: [this.data.resultados],
      correcta: [this.data.correcta],
    });
  }

  // Método para manejar el envío del formulario
  guardar(): void {
    if (this.pruebaForm.valid) {
      const formData = this.pruebaForm.value;

      formData.administratiuId = Number(formData.administratiuId);

      this.dialogRef.close(formData);
    }
  }
}
