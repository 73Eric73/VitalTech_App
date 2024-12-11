import { UsuarioService } from './../services/usuario.service';
import { Usuari } from './../interfaces/usuari.interface';
import { CamaService } from './../services/cama.service';
import { EpisodiService } from './../services/episodis.service';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Ingreso } from '../interfaces/ingreso.interface';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EpisodiMedic } from '../interfaces/episodis-medics.interface';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { Cama } from '../interfaces/cama.interface';
import { CommonModule, NumberFormatStyle } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CustomDateAdapter } from '../../apps/GoldenFold/src/app/custom-date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  dataInici,
  dataIniciFinalValidator,
} from '../../apps/GoldenFold/src/app/validators/ingresos.validators';
import { Medico } from '../interfaces/medico.interface';
import { MedicoService } from '../services/metge.service';
import { dniValidator } from '../../apps/GoldenFold/src/app/validators/dniValidator';
import { map } from 'rxjs';
import { EspecialidadesMedico } from '../../apps/GoldenFold/src/app/enums/especialidadesMedico';
import { dniExisteValidator } from '../../apps/GoldenFold/src/app/validators/dniExistsValidatos';

@Component({
  selector: 'app-dialog-formulario-medico-modif',
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
  templateUrl: '../../apps/GoldenFold/src/app/components/Formularios/Medico/dialog-formulario-ingreso-modif/dialog-formulario-medico-modif.component.html',
  styleUrls: ['../../apps/GoldenFold/src/app/components/Formularios/Medico/dialog-formulario-ingreso-modif/dialog-formulario-medico-modif.component.css'],
})
export class DialogFormularioMedicoModifComponent implements OnInit {
  isEditing: boolean = true; // Variable para controlar el modo
  medicoForm!: FormGroup;
  usuaris!: Usuari[];
  medicos!: Medico[];
  usuarioIdsMedicos = new Set('');
  especialidades = Object.entries(EspecialidadesMedico)
    .filter(([key, value]) => !isNaN(Number(value)))
    .map(([key, value]) => ({ id: value as number, nombre: key }));
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Medico,
    private medicoService: MedicoService,
    public dialogRef: MatDialogRef<DialogFormularioMedicoModifComponent>,
    private fb: FormBuilder,
    private usuariService: UsuarioService
  ) {
    this.obtenerMedicos();
  }

  ngOnInit(): void {
    this.crearFormularioMedico();
    this.obtenerUsuaris();
    if (this.data.dni) {
      this.showDetails();
    }
  }

  // Método para manejar el envío del formulario
  guardar(): void {
    if (this.medicoForm.valid) {
      const medicoActualizado: Medico = {
        ...this.data,
        ...this.medicoForm.value,
      };
      this.dialogRef.close(medicoActualizado);
    }
  }

  // Getter para simplificar el acceso al estado de solo lectura
  get isReadOnly(): boolean {
    return !this.isEditing;
  }

  // Función para habilitar el modo edición
  enableEditing(): void {
    this.isEditing = true;
    this.medicoForm.enable();
  }

  // Función para mostrar detalles (solo lectura)
  showDetails(): void {
    this.isEditing = false;
    this.medicoForm.disable();
  }

  // Función para cancelar
  cancelar(): void {
    this.dialogRef.close();
  }

  crearFormularioMedico(): void {
    this.medicoForm = this.fb.group({
      dni: [
        this.data.dni,
        {
          validators: [dniValidator()],
          asyncValidators: [
            dniExisteValidator(this.medicoService, this.data.dni),
          ],
          updateOn: 'blur',
        },
      ],
      nom: [this.data.nom],
      telefon: [this.data.telefon, [Validators.pattern('^[^a-zA-Z]*$')]],
      usuariId: [
        this.data.usuariId,
        {
          validators: [],
          asyncValidators: [],
          updateOn: 'blur',
        },
      ],
      especialitat: [this.data.especialitat],
    });
    console.log(this.medicoForm.value);
  }

  obtenerMedicos(): void {
    this.medicoService.getAll().subscribe({
      next: (data: Medico[]) => {
        this.medicos = data;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  obtenerUsuaris(): void {
    this.usuariService.getAll().subscribe({
      next: (data: Usuari[]) => {
        //usuarios con rol metge
        let usuaris = data.filter((usuari) => usuari.rolId === 'Metge');

        // usuarios disponibles
        usuaris = usuaris.filter(
          (usuari) =>
            !this.medicos.some((medico) => medico.usuariId == usuari.id)
        );
        this.usuaris = usuaris;
      },
      error: (error: any) => {
        console.log('Error al obtener los usuarios', error);
      },
    });
  }
}
