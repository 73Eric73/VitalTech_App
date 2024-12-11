import { Component, inject, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EpisodiMedic } from '../../../../libs/interfaces/episodis-medics.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
import { CustomDateAdapter } from '../../../../apps/GoldenFold/src/app/custom-date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

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
  selector: 'app-dialog-formulario-episodis-modif',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: '../../../../apps/GoldenFold/src/app/components/Formularios/Episodis/dialog-formulario-episodis-modif/dialog-formulario-episodis-modif.component.html',
  styleUrls: ['../../../../apps/GoldenFold/src/app/components/Formularios/Episodis/dialog-formulario-episodis-modif/dialog-formulario-episodis-modif.component.css'],
})
export class DialogFormularioEpisodisModifComponent {
  episodiForm!: FormGroup;
  editar: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EpisodiMedic,
    public dialogRef: MatDialogRef<DialogFormularioEpisodisModifComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.crearFormularioEpisodio();
    this.showDetails();
  }

  get isReadOnly(): boolean {
    return !this.editar;
  }

  enableEditing(): void {
    this.editar = true;
    this.episodiForm.enable();
  }

  showDetails(): void {
    this.editar = false;
    this.episodiForm.disable();
  }

  guardar(): void {
    if (this.episodiForm.valid) {
      const formData = this.episodiForm.value;

      formData.dataObertura = formatDate(
        formData.dataObertura,
        'yyyy-MM-dd',
        'en'
      );
      formData.dataTancament = formatDate(
        formData.dataTancament,
        'yyyy-MM-dd',
        'en'
      );

      this.dialogRef.close(formData);
    }
  }

  crearFormularioEpisodio(): void {
    this.episodiForm = this.fb.group({
      dataObertura: [this.data.dataObertura, [Validators.required]],
      dataTancament: [this.data.dataTancament],
      estat: [this.data.estat, [Validators.required]],
      dniPacient: [this.data.dniPacient, [Validators.required]],
    });
  }
}
