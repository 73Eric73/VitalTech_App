import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PlantesComponent } from '../../../../pages/inicio/pages/administrador-sistema/pages/plantes/plantes.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Consulta } from '../../../../interface/consulta.interface';
import { Planta } from '../../../../interface/planta.interface';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-formulario-plantas-modificar',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule,  // Necesario para ngModel
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule, // Para el botón "Cancelar" y "Guardar"
    CommonModule
  ],

  templateUrl: './dialog-formulario-plantes-modificar.component.html',
  styleUrls: ['./dialog-formulario-plantes-modificar.component.css']
})

export class DialogFormularioConsultaPlantesModificar {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Planta,
    public dialogRef: MatDialogRef<DialogFormularioConsultaPlantesModificar>) { };

  // Método para manejar el envío del formulario
  guardar(): void {
    this.dialogRef.close(this.data);
  }
}
