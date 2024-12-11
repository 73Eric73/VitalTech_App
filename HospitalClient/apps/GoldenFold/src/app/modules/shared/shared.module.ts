import { NavComponent } from './../../../../../VitalTech/src/app/components/nav/nav.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';

// Angular Material Imports

import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// Componentes personalizados
import { DialogFormularioComponent } from '../../components/Formularios/Paciente/dialog-formulario-paciente-create/dialog-formulario.component';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { DialogFormulariocamaComponent } from '../../components/Formularios/Cama/dialog-formulario-cama-registro/dialog-formulario-cama.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatCardTitle } from '@angular/material/card';
import { MatSelect } from '@angular/material/select';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatOption,
    MatCardTitle,
    MatSelect,
    MatSelectModule,
    MatOptionModule,
    DialogFormularioComponent,
    MatTableModule,
    MatPaginatorModule,
    NavComponent,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    NavComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    SearchBoxComponent,
    SnackbarComponent,
    DialogFormulariocamaComponent,
    MatCheckboxModule,
    NavComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    NavComponent,
    ReactiveFormsModule,
    MatCardModule,
    NavComponent,
    MatOption,
    MatCardTitle,
    MatSelect,
    MatSelectModule,
    MatOptionModule,
    DialogFormularioComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    SearchBoxComponent,
    SnackbarComponent,
    DialogFormulariocamaComponent,
    MatCheckboxModule,
    NavComponent
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
})
export class SharedModule {}
