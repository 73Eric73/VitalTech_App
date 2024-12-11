import { AdministradorSistemaDashboardComponent } from './../../../../../GoldenFold/src/app/pages/inicio/pages/administrador-sistema/administrador-sistema-dashboard/administrador-sistema-dashboard.component';
import { AdministradorSistemaDashboardComponent } from './../../../../../GoldenFold/src/app/pages/inicio/pages/administrador-sistema/administrador-sistema-dashboard/administrador-sistema-dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from '../../components/nav/nav.component';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { EnumTranslatePipe } from '../../pipes/enum-translate.pipe';
import { MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { DialogFormularioComponent } from '../../../../../GoldenFold/src/app/components/Formularios/Paciente/dialog-formulario-paciente-create/dialog-formulario.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SearchBoxComponent } from '../../../../../GoldenFold/src/app/components/search-box/search-box.component';
import { SnackbarComponent } from '../../../../../GoldenFold/src/app/components/snackbar/snackbar.component';
import { DialogFormulariocamaComponent } from '../../../../../GoldenFold/src/app/components/Formularios/Cama/dialog-formulario-cama-registro/dialog-formulario-cama.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { DialogFormularioComponent } from '../../../../../GoldenFold/src/app/components/Formularios/Paciente/dialog-formulario-paciente-create/dialog-formulario.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SearchBoxComponent } from '../../../../../GoldenFold/src/app/components/search-box/search-box.component';
import { SnackbarComponent } from '../../../../../GoldenFold/src/app/components/snackbar/snackbar.component';
import { DialogFormulariocamaComponent } from '../../../../../GoldenFold/src/app/components/Formularios/Cama/dialog-formulario-cama-registro/dialog-formulario-cama.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
 
@NgModule({
  declarations: [EnumTranslatePipe],
  imports: [
    CommonModule,
    AdministradorSistemaDashboardComponent,
    ReactiveFormsModule,
    NavComponent,
    RouterLinkActive,
    FormsModule,
    RouterLink,
    RouterModule,
    AdministradorSistemaDashboardComponent,
    MatCardModule,
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
    AdministradorSistemaDashboardComponent,
    MatCardModule,
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
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    NavComponent,
    RouterLinkActive,
    AdministradorSistemaDashboardComponent,
    AdministradorSistemaDashboardComponent,
    FormsModule,
    RouterLink,
    RouterModule,
    EnumTranslatePipe,
    MatCardModule,
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
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    MatCardModule,
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
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
})
export class SharedModule {}