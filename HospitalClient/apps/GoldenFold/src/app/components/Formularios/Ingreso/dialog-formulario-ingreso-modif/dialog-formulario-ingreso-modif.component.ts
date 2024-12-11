import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Ingreso } from '../../../../../../../../libs/interfaces/ingreso.interface';
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
import { EpisodiMedic } from '../../../../../../../../libs/interfaces/episodis-medics.interface';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { EpisodiService } from '../../../../../../../../libs/services/episodis.service';
import { Cama } from '../../../../../../../../libs/interfaces/cama.interface';
import { CamaService } from '../../../../../../../../libs/services/cama.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CustomDateAdapter } from '../../../../custom-date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  dataInici,
  dataIniciFinalValidator,
} from '../../../../validators/ingresos.validators';

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
  selector: 'app-dialog-formulario-ingreso-modif',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    MatOptionModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './dialog-formulario-ingreso-modif.component.html',
  styleUrls: ['./dialog-formulario-ingreso-modif.component.css'],
})
export class DialogFormularioIngresoModifComponent implements OnInit {
  episodisMedics: EpisodiMedic[] = [];
  llits: Cama[] = [];
  isEditing: boolean = true; // Variable para controlar el modo
  ingresoForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Ingreso,
    public dialogRef: MatDialogRef<DialogFormularioIngresoModifComponent>,
    private episodiService: EpisodiService,
    private fb: FormBuilder,
    private camaService: CamaService
  ) {}

  ngOnInit(): void {
    this.obtenerEpisodisMedics();
    this.obtenerCamas();
    this.crearFormularioIngreso();
    if (this.data.id) {
      this.showDetails();
    }
  }

  // Método para manejar el envío del formulario
  guardar(): void {
    if (this.ingresoForm.valid) {
      const ingresoActualizado: Ingreso = {
        ...this.data,
        ...this.ingresoForm.value,
        dataEntrada: new Date(
          new Date(this.ingresoForm.value.dataEntrada).setDate(
            new Date(this.ingresoForm.value.dataEntrada).getDate() + 1
          )
        ),
      };
      if (this.ingresoForm.value.dataSortida != null) {
        ingresoActualizado.dataSortida = new Date(
          new Date(this.ingresoForm.value.dataSortida).setDate(
            new Date(this.ingresoForm.value.dataSortida).getDate() + 1
          )
        );
      }
      this.dialogRef.close(ingresoActualizado);
    }
  }

  // Getter para simplificar el acceso al estado de solo lectura
  get isReadOnly(): boolean {
    return !this.isEditing;
  }

  // Función para habilitar el modo edición
  enableEditing(): void {
    this.isEditing = true;
    this.ingresoForm.enable();
  }

  // Función para mostrar detalles (solo lectura)
  showDetails(): void {
    this.isEditing = false;
    this.ingresoForm.disable();
  }

  // Función para cancelar
  cancelar(): void {
    this.dialogRef.close();
  }

  // Obtener la lista de episodios médicos desde el servicio correspondiente
  obtenerEpisodisMedics(): void {
    this.episodiService.getAll().subscribe({
      next: (data: EpisodiMedic[]) => {
        this.episodisMedics = data;
      },
      error: (error: any) => {
        console.log('Error al cargar los episodios médicos', error);
      },
    });
  }

  // Obtener la lista de camas disponibles desde el servicio correspondiente
  obtenerCamas(): void {
    this.camaService.getAll().subscribe({
      next: (data: Cama[]) => {
        this.llits = data.filter(
          (llit) =>
            (!llit.ocupat && !llit.foraDeServei) ||
            llit.codiLlit === this.ingresoForm.get('codiLlit')?.value
        );
      },
      error: (error: any) => {
        console.error('Error al cargar las camas', error);
      },
    });
  }

  crearFormularioIngreso(): void {
    this.ingresoForm = this.fb.group(
      {
        id: [this.data.id],
        dataEntrada: [this.data.dataEntrada],
        dataSortida: [this.data.dataSortida],
        episodiMedicId: [this.data.episodiMedicId, [Validators.required]],
        codiLlit: [this.data.codiLlit, [Validators.required]],
      },
      {
        validators: [dataIniciFinalValidator(), dataInici()],
      }
    );
  }
}
