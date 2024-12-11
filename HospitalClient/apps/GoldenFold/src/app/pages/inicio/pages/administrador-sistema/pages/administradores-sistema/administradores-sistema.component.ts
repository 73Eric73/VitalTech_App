import { AdministradorSistemaService } from './../../../../../../../../../../libs/services/administrador-sistema.service';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarComponent } from '../../../../../../components/snackbar/snackbar.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { retry } from 'rxjs';
import { AdministradorSistema } from '../../../../../../../../../../libs/interfaces/administrador-sistema.interface';
@Component({
  selector: 'app-administradores-sistema',
  templateUrl: './administradores-sistema.component.html',
  styleUrl: './administradores-sistema.component.css',
})
export class AdministradoresSistemaComponent {
  displayedColumns: string[] = [
    'dni',
    'nom',
    'telefon',
    'usuariId',
    'prioridad',
    'actions',
  ];
  administradores: MatTableDataSource<AdministradorSistema> =
    new MatTableDataSource<AdministradorSistema>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  administradorSistemaForm!: FormGroup;
  administradorSistemaParaActualizar: AdministradorSistema | null = null;

  constructor(
    private administradorSistemaService: AdministradorSistemaService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.obtenerAdministradoresDeSistema();
    this.crearFormularioAdministradorDeSistema();
  }

  obtenerAdministradoresDeSistema(): void {
    this.administradorSistemaService.getAll().subscribe({
      next: (data: AdministradorSistema[]) => {
        this.administradores.data = data;
        this.administradores.sort = this.sort;
        this.administradores.paginator = this.paginator;
        console.log('Administradores de sistema:', this.administradores.data);
      },
      error: (error: any) => {
        console.log('ERROR:', error);
      },
    });
  }

  crearFormularioAdministradorDeSistema(): void {
    this.administradorSistemaForm = this.fb.group({
      dni: ['', Validators.required],
      nom: ['', Validators.required],
      telefon: [0],
      usuariId: ['', Validators.required],
      especialitat: ['', Validators.required],
    });
  }

  eliminarAdministradorSistema(administrador: AdministradorSistema): void {
    this.administradorSistemaService.delete(administrador.dni).subscribe({
      next: () => {
        this.obtenerAdministradoresDeSistema();
        this.snackbar.showNotification(
          'success',
          'Administrador de sistema eliminado correctamente'
        );
      },
      error: (error: any) => {
        console.log('ERR0R', error);
      },
    });
  }

  filtrarAdministradoresDeSistema(event: { type: string; term: string }): void {
    const { type, term } = event;
    const searchTerm = term.trim().toLowerCase();

    this.administradores.filterPredicate = (
      data: AdministradorSistema,
      filter: string
    ) => {
      switch (type) {
        case 'dni':
          return data.dni.toString().toLowerCase().includes(filter);
        case 'nom':
          return data.nom.toString().toLowerCase().includes(filter);
        case 'usuariId':
          return data.usuariId.toString().toLowerCase().includes(filter);
        case 'telefon':
          return data.telefon.toString().toLowerCase().includes(filter);
        case 'prioridad':
          return data.prioridad.toString().toLowerCase().includes(filter);
        default:
          return false;
      }
    };
    this.administradores.filter = searchTerm;
    if (this.administradores.paginator) {
      this.administradores.paginator.firstPage();
    }
  }

  toggleAgregarAdministradorSistema(): void {
    this.crearFormularioAdministradorDeSistema();
  }
}
