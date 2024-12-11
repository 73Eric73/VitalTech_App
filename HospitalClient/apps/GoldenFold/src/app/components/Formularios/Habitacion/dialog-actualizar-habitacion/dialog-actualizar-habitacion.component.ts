import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Inject } from '@angular/core';
import { Habitacion } from '../../../../../../../../libs/interfaces/habitacion.interface';
import { CommonModule } from '@angular/common';
import { PlantaService } from '../../../../../../../../libs/services/planta.service';
import { Planta } from '../../../../../../../../libs/interfaces/planta.interface';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { pisoCodigoValidator } from '../../../../validators/habitacion.validator';

@Component({
  selector: 'app-dialog-actualizar-habitacion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './dialog-actualizar-habitacion.component.html',
  styleUrls: ['./dialog-actualizar-habitacion.component.css'],
})
export class DialogActualizarHabitacionComponent {
  habForm!: FormGroup;
  plantas: Planta[] = [];
  editar: boolean = false;

  private plantaService = inject(PlantaService);
  private dialogRef = inject(MatDialogRef<DialogActualizarHabitacionComponent>);
  private fb = inject(FormBuilder);
  @Inject(MAT_DIALOG_DATA) public data: Habitacion;

  ngOnInit(): void {
    this.crearFormularioPlanta();
    this.mostrarDetalles();
    this.obtenerPlantas();

    // Escucha cambios en el campo 'codiHabitacio'
    this.habForm.get('codiHabitacio')?.valueChanges.subscribe(() => {
      this.obtenerPlantas();
    });
  }

  get isReadOnly(): boolean {
    return !this.editar;
  }

  enableEditing(): void {
    this.editar = true;
    this.habForm.enable();
  }

  mostrarDetalles(): void {
    this.editar = false;
    this.habForm.disable();
  }

  crearFormularioPlanta(): void {
    this.habForm = this.fb.group(
      {
        codiHabitacio: [
          this.data.codiHabitacio,
          [Validators.required, Validators.pattern(/^\d{3}$/)],
        ],
        capacitatLlits: [
          this.data.capacitatLlits,
          [Validators.required, Validators.pattern(/^[1-2]$/)],
        ],
        plantaId: [this.data.plantaId, [Validators.required]],
        llits: [''],
      },
      { validators: pisoCodigoValidator }
    );
  }

  guardar(): void {
    if (this.habForm.valid) {
      const formData = this.habForm.value;
      this.dialogRef.close(formData);
    } else {
      // Muestra un mensaje de error si el formulario no es válido
      this.habForm.markAllAsTouched();
    }
  }

  obtenerPlantas(): void {
    this.plantaService.getAll().subscribe({
      next: (data: Planta[]) => {
        const codiHabitacio = this.habForm.get('codiHabitacio')?.value;

        if (!codiHabitacio) {
          this.plantas = data;
        } else {
          const firstNumber = Number(String(codiHabitacio).substring(0, 1));
          this.plantas = data.filter(
            (planta) =>
              (planta.capacitatHabitacions > planta.habitacions.length &&
                planta.piso === firstNumber) ||
              planta.piso === this.habForm.get('plantaId')?.value
          );
        }
      },
      error: () => {
        console.error('Error al obtener las plantas');
      },
    });
  }
}