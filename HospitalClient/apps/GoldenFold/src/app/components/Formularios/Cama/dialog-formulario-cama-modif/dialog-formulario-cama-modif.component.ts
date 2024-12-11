import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Cama } from '../../../../../../../../libs/interfaces/cama.interface';
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
import { Habitacion } from '../../../../../../../../libs/interfaces/habitacion.interface';
import { HabitacionService } from '../../../../../../../../libs/services/habitacion.service';
@Component({
  selector: 'app-dialog-formulario-cama-modif',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule, // Necesario para ngModel
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule, // Para el botón "Cancelar" y "Guardar"
  ],
  templateUrl: './dialog-formulario-cama-modif.component.html',
  styleUrls: ['./dialog-formulario-cama-modif.component.css'],
})
export class DialogFormulariocamaModifComponent {
  habitaciones: Habitacion[] = [];
  camaForm: FormGroup;
  isEditing: boolean = true; // Variable para controlar el modo

  constructor(
    private fb: FormBuilder, // Inyectamos el FormBuilder
    private habitacionService: HabitacionService,
    @Inject(MAT_DIALOG_DATA) public data: Cama,
    public dialogRef: MatDialogRef<DialogFormulariocamaModifComponent>
  ) {
    // Inicializamos el FormGroup con los campos requeridos
    this.camaForm = this.fb.group({
      codiLlit: [data.codiLlit, Validators.required],
      foraDeServei: [data.foraDeServei, Validators.required],
      codiHabitacio: [data.codiHabitacio, Validators.required],
    });
    this.showDetails();
  }

  // Método para manejar el envío del formulario
  guardar(): void {
    if (this.camaForm.valid) {
      // Combina los valores existentes con los nuevos
      const updatedCama = { ...this.data, ...this.camaForm.value };
      updatedCama.codiHabitacio = Number(updatedCama.codiHabitacio); // Asegúrate de que sea un número

      // Cierra el diálogo y pasa el objeto actualizado
      this.dialogRef.close(updatedCama);
    }
  }

  ngOnInit(): void {
    this.obtenerHabitaciones();
  }

  get isReadOnly(): boolean {
    return !this.isEditing;
  }

  // Función para habilitar el modo edición
  enableEditing(): void {
    this.isEditing = true;
    this.camaForm.enable();
  }

  // Función para mostrar detalles (solo lectura)
  showDetails(): void {
    this.isEditing = false;
    this.camaForm.disable();
  }

  // Función para cancelar
  cancelar(): void {
    this.dialogRef.close();
  }

  obtenerHabitaciones(): void {
    this.habitacionService.getAll().subscribe({
      next: (data: Habitacion[]) => {
        this.habitaciones = data.filter(
          (habitacion) =>
            habitacion.capacitatLlits > habitacion.llits.length ||
            habitacion.codiHabitacio ===
              this.camaForm.get('codiHabitacio')?.value
        );
        console.log('Habitaciones cargadas:', this.habitaciones);
      },
      error: (error: any) => {
        console.error('Error al cargar las habitaciones');
      },
    });
  }
}
