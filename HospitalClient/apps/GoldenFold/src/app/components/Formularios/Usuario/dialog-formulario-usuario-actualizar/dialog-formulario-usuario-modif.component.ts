import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Personal } from '../../../../../../../../libs/interfaces/personal.interface';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-dialog-formulario-usuario-modif',
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
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-formulario-usuario-modif.component.html',
  styleUrls: ['./dialog-formulario-usuario-modif.component.css'],
})
export class DialogFormularioUsuarioModifComponent {
  personalForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Personal,
    public dialogRef: MatDialogRef<DialogFormularioUsuarioModifComponent>
  ) {
    this.personalForm = new FormGroup({
      dni: new FormControl(''),
      nom: new FormControl(''),
      especialitat: new FormControl(''),
    });
  }

  guardar(): void {
    this.data.nom = this.personalForm.value.nom;
    this.data.especialitat = this.personalForm.value.especialitat;

    this.dialogRef.close(this.data);
  }
}
