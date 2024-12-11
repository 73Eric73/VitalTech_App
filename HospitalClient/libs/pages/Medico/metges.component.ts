import { UsuarioService } from './../../services/usuario.service';
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Medico } from '../../interfaces/medico.interface';
import { MatPaginator } from '@angular/material/paginator';
import { SnackbarComponent } from '../../../apps/GoldenFold/src/app/components/snackbar/snackbar.component';
import { MatSort } from '@angular/material/sort';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicoService } from '../../services/metge.service';
import { MatDialog } from '@angular/material/dialog';
import { MedicoDashboardComponent } from '../../../apps/GoldenFold/src/app/pages/inicio/pages/medico/medico-dashboard/medico-dashboard.component';
import { DialogFormularioMedicoModifComponent } from '../../forms/dialog-formulario-medico-modif.component';
import { EpisodiosDialogComponent } from '../../../apps/GoldenFold/src/app/components/popups/episodis-popup';
import { PruebasDialogComponent } from '../../../apps/GoldenFold/src/app/components/popups/pruebas-popup';
import { Usuari } from '../../interfaces/usuari.interface';

@Component({
  selector: 'app-metges',
  templateUrl: './metges.component.html',
  styleUrls: [],
})
export class MetgesComponent {
  //columnas a mostrar
  displayedColumns: string[] = [
    'dni',
    'nom',
    'usuariId',
    'telefon',
    'especialitat',
    'episodiMedics',
    'pruebasDiagnosticas',
    'Actions',
  ];
  medicos: MatTableDataSource<Medico> = new MatTableDataSource<Medico>([]);
  usuarios: MatTableDataSource<Usuari> = new MatTableDataSource<Usuari>([]);

  currentPort: string;
  isPortGolden: boolean;

  //paginator, ordenador y snackbar(para las notificaciones)
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  //formularios reactivos
  medicoForm!: FormGroup;
  medicoParaActualizar: Medico | null = null;

  templateUrl!: string
  styleUrls!: string[]
  cssPaths!: string[];

  constructor(
    private medicoService: MedicoService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {
    //cambiar html
    this.currentPort = window.location.port;
    this.isPortGolden = this.currentPort==="4201"; //4201

    //cambiar css
    if (this.isPortGolden) { 
      //css golden
      this.cssPaths = ['/assets/styles/styles.css','/assets/styles/medico/4001.component.css'];
    } else {
      //css vital
      this.cssPaths = ['/assets/styles/styles.css','/assets/styles/medico/4000.component.css'];
    }
 
    this.cssPaths.forEach(css => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = css;
      document.head.appendChild(link);
    });

    this.obtenerUsuarios();
    this.crearFormularioMedico();
  }

  ngAfterViewInit(): void {
    this.medicos.paginator = this.paginator;
    this.medicos.sort = this.sort;
  }

  //metodo para obtener medicos
  obtenerMedicos(): void {
    this.medicoService.getAll().subscribe({
      next: (data: Medico[]) => {
        this.medicos.data = data;
      },
      error: (error: any) => {
        console.error('Error al obtener los medicos', error);
      },
    });
  }

  //crear el formulario reactivo
  crearFormularioMedico(): void {
    this.medicoForm = this.fb.group({
      dni: ['', Validators.required],
      nom: ['', Validators.required],
      telefon: [0],
      usuariId: [0, Validators.required],
      especialitat: ['', Validators.required],
    });
  }

  agregarMedico(): void {
    if (this.medicoForm.valid) {
      const nuevoMedico: Medico = this.medicoForm.value;
      this.medicoService.post(nuevoMedico).subscribe({
        next: (medico: Medico) => {
          console.log('Medico', medico);
          this.medicos.data = [...this.medicos.data, medico];
          this.obtenerMedicos();
          this.medicoForm.reset();
          this.snackbar.showNotification('success', 'Medico creado con exito'); // Notificación de éxito
        },
        error: (error: any) => {
          const mensajeError =
            error.error || 'Error inesperado. Inténtalo de nuevo.';
          this.snackbar.showNotification('error', mensajeError); // Notificación de éxito
        },
      });
    }
  }

  actualizarMedico(dniAntiguo: string): void {
    if (this.medicoParaActualizar) {
      const medicoActualizado = { ...this.medicoParaActualizar };
      this.medicoService.put(dniAntiguo, medicoActualizado).subscribe({
        next: () => {
          this.obtenerMedicos();
          this.medicoParaActualizar = null;
          this.medicoForm.reset();
          this.snackbar.showNotification(
            'success',
            'Médico actualizado correctamente'
          ); // Notificación de éxito
        },
        error: (error: any) => {
          console.error('Error al actualizar el medico', error);
        },
      });
    }
  }

  tooggleAgregarMedico(): void {
    this.crearFormularioMedico();
    this.dialog
      .open(DialogFormularioMedicoModifComponent, {
        data: this.medicoForm,
      })
      .afterClosed()
      .subscribe((medicoActualizado) => {
        if (medicoActualizado) {
          this.medicoForm.patchValue(medicoActualizado);
          console.log(this.medicoForm.value);
          this.agregarMedico();
        }
      });
  }

  tooggleActualizarMedico(medico: Medico): void {
    this.medicoParaActualizar = { ...medico };
    this.dialog
      .open(DialogFormularioMedicoModifComponent, {
        data: this.medicoParaActualizar,
      })
      .afterClosed()
      .subscribe((medicoActualizado) => {
        if (medicoActualizado) {
          this.medicoParaActualizar = medicoActualizado;
          this.actualizarMedico(medico.dni);
        }
      });
  }

  filtrarMedicos(event: { type: string; term: string }): void {
    const { type, term } = event;
    const searchterm = term.trim().toLowerCase();

    this.medicos.filterPredicate = (data: Medico, filter: string) => {
      switch (type) {
        case 'dni':
          return data.dni.toString().toLowerCase().includes(filter);
        case 'nom':
          return data.nom.toString().toLowerCase().includes(filter);
        case 'usuariId':
          return data.usuariId.toString().toLowerCase().includes(filter);
        case 'telefon':
          return data.telefon.toString().toLowerCase().includes(filter);
        case 'especialita':
          return data.especialitat.toString().toLowerCase().includes(filter);
        default:
          return false;
      }
    };
    this.medicos.filter = searchterm;

    if (this.medicos.paginator) {
      this.medicos.paginator.firstPage();
    }
  }

  borrarMedico(dni: string): void {
    this.medicoService.delete(dni).subscribe({
      next: () => {
        this.medicos.data = this.medicos.data.filter((i) => i.dni != dni);
        this.snackbar.showNotification(
          'success',
          'Médico eliminado correctamente'
        ); // Notificación de éxito
      },
      error: (error: any) => {
        console.log('ERROR', error);
      },
    });
  }

  verEpisodiosMedicos(medico: Medico) {
    this.dialog.open(EpisodiosDialogComponent, {
      maxWidth: 'none',
      maxHeight: 'none',
      data: medico.episodiMedics,
    });
  }

  verPruebasDiagnosticas(medico: Medico) {
    this.dialog.open(PruebasDialogComponent, {
      maxWidth: 'none',
      maxHeight: 'none',
      data: medico.pruebasDiagnosticas,
    });
  }

  obtenerUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (data: Usuari[]) => {
        this.usuarios.data = data;
        this.obtenerMedicos();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  obtenerNombreUsuario(id: number): string | null {
    const user = this.usuarios.data.find((p) => p.id == id);
    if (user == null) {
      return null;
    }
    return user?.username;
  }
}
