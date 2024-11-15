import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Cama } from '../../../../interface/cama.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Consulta } from '../../../../interface/consulta.interface';

@Component({
  selector: 'app-dialog-formulario-consulta',
  standalone: true,
  imports: [ReactiveFormsModule, 
    FormsModule,  // Necesario para ngModel
    MatFormFieldModule, 
    MatInputModule, 
    MatDialogModule,
    MatButtonModule // Para el botón "Cancelar" y "Guardar"
    ],
  templateUrl: './dialog-formulario-consulta.component.html',
  styleUrls: ['./dialog-formulario-consulta.component.css']
})
export class DialogFormularioConsultaComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Consulta, 
    public dialogRef: MatDialogRef<DialogFormularioConsultaComponent>
  ) {
  }


  // Método para manejar el envío del formulario
  guardar(): void {
    this.dialogRef.close(this.data);  
  }
}
