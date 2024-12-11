import { UsuarioService } from './../../../../../../../../libs/services/usuario.service';
import { EnfermeroService } from './../../../../../../../../libs/services/enfermero.service';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
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
import { EpisodiMedic } from '../../../../../../../../libs/interfaces/episodis-medics.interface';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { CommonModule, NumberFormatStyle } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Medico } from '../../../../../../../../libs/interfaces/medico.interface';
import { Usuari } from '../../../../../../../../libs/interfaces/usuari.interface';
import { MedicoService } from '../../../../../../../../libs/services/metge.service';
import { dniValidator } from '../../../../validators/dniValidator';
import { map } from 'rxjs';
import { Enfermero } from '../../../../../../../../libs/interfaces/enfermer.interface';
import { EspecialidadesEnfermero } from '../../../../enums/especialidadesEnfermero';
import { EnfermeroAsyncValidator } from '../../../../validators/enfermeroExistsValidator';
import { dniExisteValidator } from '../../../../validators/dniExistsValidatos';
@Component({
  selector: 'app-dialog-formulario-enfermero-modif',
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
  templateUrl: './dialog-formulario-enfermero-modif.component.html',
  styleUrls: ['./dialog-formulario-enfermero-modif.component.css'],
})
export class DialogFormularioEnfermeroModifComponent implements OnInit {
  isEditing: boolean = true; // Variable para controlar el modo
  enfermeroForm!: FormGroup;
  usuaris!: Usuari[];
  medicos!: Medico[];
  usuarioIdsEnfermeros = new Set('');
  especialidades = Object.entries(EspecialidadesEnfermero)
    .filter(([key, value]) => !isNaN(Number(value)))
    .map(([key, value]) => ({ id: value as number, nombre: key }));
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Medico,
    private medicoService: MedicoService,
    private enfermeroService: EnfermeroService,
    public dialogRef: MatDialogRef<DialogFormularioEnfermeroModifComponent>,
    private fb: FormBuilder,
    private usuariService: UsuarioService,
    private enfermeroValidator: EnfermeroAsyncValidator
  ) {}

  ngOnInit(): void {
    this.crearFormularioEnfermero();
    this.obtenerUsuaris();
    if (this.data.dni) {
      this.showDetails();
    }
  }

  // Método para manejar el envío del formulario
  guardar(): void {
    if (this.enfermeroForm.valid) {
      const enfermeroActualizado: Enfermero = {
        ...this.data,
        ...this.enfermeroForm.value,
      };
      enfermeroActualizado.dni = enfermeroActualizado.dni.toUpperCase();
      this.dialogRef.close(enfermeroActualizado);
    }
  }

  // Getter para simplificar el acceso al estado de solo lectura
  get isReadOnly(): boolean {
    return !this.isEditing;
  }

  // Función para habilitar el modo edición
  enableEditing(): void {
    this.isEditing = true;
    this.enfermeroForm.enable();
  }

  // Función para mostrar detalles (solo lectura)
  showDetails(): void {
    this.isEditing = false;
    this.enfermeroForm.disable();
  }

  // Función para cancelar
  cancelar(): void {
    this.dialogRef.close();
  }

  crearFormularioEnfermero(): void {
    this.enfermeroForm = this.fb.group({
      dni: [
        this.data.dni,
        {
          validators: [dniValidator()],
          asyncValidators: [
            dniExisteValidator(this.enfermeroService, this.data.dni),
          ],
          updateOn: 'blur',
        },
      ],
      nom: [this.data.nom],
      telefon: [this.data.telefon, [Validators.pattern('^[^a-zA-Z]*$')]],
      usuariId: [
        this.data.usuariId,
        [],
        (control: AbstractControl) => {
          return this.enfermeroValidator.validate(control).pipe(
            map((result) => {
              // solo actua el validador si el usuario lo toca
              return control.touched ? result : null;
            })
          );
        },
      ],
      especialitat: [this.data.especialitat],
    });
  }

  obtenerUsuaris(): void {
    this.usuariService.getAll().subscribe({
      next: (data: Usuari[]) => {
        //cojemos los usuarios con rolId medico
        this.usuaris = data.filter((usuari) => usuari.rolId === 'Enfermer');
      },
      error: (error: any) => {
        console.log('Error al obtener los usuarios');
      },
    });
  }
}
