import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { pisoCodigoValidator } from '../../../../../validators/habitacion.validator';
import { PlantaService } from '../../../../../../../../../libs/services/planta.service';
import { Planta } from '../../../../../../../../../libs/interfaces/planta.interface';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dialog-crear-habitacion',
  templateUrl: './dialog-crear-habitacion.component.html',
  styleUrl: './dialog-crear-habitacion.component.css',
  imports: [ReactiveFormsModule,
    FormsModule,  // Necesario para ngModel
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatOptionModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule
  ]
})
export class DialogCrearHabitacionComponent {
  //Variables principales de la clase
  habForm!: FormGroup;
  plantas: Planta[] = [];

  ngOnInit(): void {
    this.crearFormularioPlanta();
    this.obtenerPlantas();

    // Escuchar cambios en los campos para actualizar la lista de plantas
    this.habForm.get('plantaId')?.valueChanges.subscribe(() => this.obtenerPlantas());
    this.habForm.get('codiHabitacio')?.valueChanges.subscribe(() => {
      // Cada vez que el código de habitación cambie, revalidamos el formulario
      this.habForm.updateValueAndValidity();
      this.obtenerPlantas();
    });

  }
  constructor(private dialog: MatDialogRef<DialogCrearHabitacionComponent>, private fb: FormBuilder, private plantaService: PlantaService) {
    
  }

  crearFormularioPlanta(): void {
    this.habForm = this.fb.group({
      codiHabitacio: ['' ,[Validators.required, Validators.pattern(/^\d{3}$/)]],
      capacitatLlits: ['' , [Validators.required, Validators.pattern(/^[1-2]$/)]],
      plantaId: ['' , [Validators.required]],
      llits: ['']
    });
    this.habForm.setValidators(pisoCodigoValidator());
  }

  obtenerPlantas(): void {
    this.plantaService.getAll().subscribe({
      next: (data: Planta[]) => {
        const codiHabitacio = this.habForm.get('codiHabitacio')?.value;
        if (!codiHabitacio  || codiHabitacio.length !== 3) {
          this.plantas = data;

        } else {
          const firstNumber = Number(String(codiHabitacio).substring(0, 1));
          this.plantas = data.filter(planta =>
            (planta.capacitatHabitacions > planta.habitacions.length && planta.piso === firstNumber) ||
            planta.piso === this.habForm.get('plantaId')?.value
          );
        }
    }})
  }


  //guardar form
  guardar(): void {
    if (this.habForm.valid) {
      const formData = this.habForm.value;
      formData.codiHabitacio = Number(formData.codiHabitacio);
      formData.capacitatLlits = Number(formData.capacitatLlits);
      formData.plantaId = Number(formData.plantaId);
      formData.llits = [];
      this.dialog.close(formData);
    }
  }
}