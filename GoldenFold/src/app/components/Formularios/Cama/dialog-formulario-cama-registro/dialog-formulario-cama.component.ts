import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Cama } from '../../../../interface/cama.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Habitacion } from '../../../../interface/habitacion.interface';
import { HabitacionService } from '../../../../services/habitacion.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-formulario-cama',
  standalone: true,
  imports: [ReactiveFormsModule, 
    FormsModule,  // Necesario para ngModel
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatOptionModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule// Para el botón "Cancelar" y "Guardar"
    ],
  templateUrl: './dialog-formulario-cama.component.html',
  styleUrls: ['./dialog-formulario-cama.component.css']
})
export class DialogFormulariocamaComponent {
  habitaciones: Habitacion[] = [];
  camaForm: FormGroup;

 constructor(
    private fb: FormBuilder,  // Inyectamos el FormBuilder
    private habitacionService: HabitacionService,
    @Inject(MAT_DIALOG_DATA) public data: Cama, 
    public dialogRef: MatDialogRef<DialogFormulariocamaComponent>
  ) {
    // Inicializamos el FormGroup con los campos requeridos
    this.camaForm = this.fb.group({
      codiLlit: ['', Validators.required],
      codiHabitacio: ['', Validators.required]
    });
  }

  // Método para manejar el envío del formulario
  guardar(): void {
    if (this.camaForm.valid) {
      const formData = this.camaForm.value;
      formData.codiHabitacio = Number(formData.codiHabitacio);
      formData.ocupat = false;
      formData.foraDeServei = false;
      formData.ingressos = [];
      this.dialogRef.close(formData);
    }
  }

  ngOnInit(): void {
    this.obtenerHabitaciones();
  }

  obtenerHabitaciones(): void {
    this.habitacionService.getAll().subscribe({
      next: (data: Habitacion[]) => {
        this.habitaciones = data.filter(habitacion => habitacion.capacitatLlits > habitacion.llits.length);
        console.log('Habitaciones cargadas:', this.habitaciones);
      },
      error: (error: any) =>{
        console.error('Error al cargar las habitaciones');
      }
    })
  }
}
