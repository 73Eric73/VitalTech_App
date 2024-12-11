import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
} from '@angular/core';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../interfaces/paciente.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormularioComponent } from '../../../apps/GoldenFold/src/app/components/Formularios/Paciente/dialog-formulario-paciente-create/dialog-formulario.component';
import { SnackbarComponent } from '../../../apps/GoldenFold/src/app/components/snackbar/snackbar.component';
import { EpisodiosDialogComponent } from '../../../apps/GoldenFold/src/app/components/popups/episodis-popup';
import { DialogPacienteComponent } from '../../../apps/GoldenFold/src/app/components/Formularios/Paciente/dialog-paciente-lista-modif/dialog-paciente-lista-modif.component';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: [],
})
export class PacientesComponent implements OnInit, AfterViewInit {

  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Variables relacionadas con la tabla y los datos
  displayedColumns: string[] = [
    'dni',
    'numSS',
    'nom',
    'birthDay',
    'sexe',
    'estado',
    'episodisMedics',
    'acciones',
  ];
  dataSource: MatTableDataSource<Paciente> = new MatTableDataSource<Paciente>(
    []
  );
  totalItems = 0;
  itemsPerPage = 300;
  pageIndex = 0;
  isPortGolden = true;
  pacientes: Paciente[] = [];
  nuevoPaciente: Paciente;
  notificacion: string | null = null; // Variable para notificaciones

  pacienteSeleccionado: Paciente | null = null;

  constructor(
    private pacienteService: PacienteService,
    public dialog: MatDialog
  ) {
    this.nuevoPaciente = {
      dni: '',
      numSS: '',
      nom: '',
      cognom1: '',
      cognom2: '',
      sexe: '',
      telefono: '',
      nacionalidad: '',
      email: '',
      administratiuId: 0,
      birthDay: '',
      estado: '',
      episodisMedics: [],
    };
  }

  ngOnInit(): void {

    let port = window.location.port;

    let cssPath: string[];
   
    if (port == '4201') {
      this.isPortGolden = true;
      cssPath = ['/assets/styles/styles.css','/assets/styles/pacientes/pacientes-4201.component.css'];
    } else {
      this.isPortGolden = false;
      cssPath = ['/assets/styles/styles.css','/assets/styles/pacientes/pacientes-4200.component.css'];
    }

    cssPath.forEach(css => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = css;
      document.head.appendChild(link);
    });

    this.obtenerPacientes();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  verEpisodios(paciente: any): void {
    console.log(paciente.episodisMedics);
    this.dialog.open(EpisodiosDialogComponent, {
      width: '1200px',
      data: paciente.episodisMedics,
    });
  }

  obtenerPacientes(): void {
    this.pacienteService.getAll().subscribe({
      next: (data: Paciente[]) => {
        this.pacientes = data;
        this.totalItems = data.length;
        this.actualizarPagina(0, this.itemsPerPage);
      },
      error: (error: any) => {
        console.error('Error al obtener los pacientes', error);
      },
    });
  }

  onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.actualizarPagina(this.pageIndex, this.itemsPerPage);
  }

  actualizarPagina(pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.dataSource.data = this.pacientes.slice(startIndex, endIndex);
  }

  // Mostrar el formulario para actualizar paciente
  toggleActualizarPaciente(paciente: Paciente): void {
    this.pacienteSeleccionado = { ...paciente };
    this.dialog
      .open(DialogPacienteComponent, {
        data: this.pacienteSeleccionado,
      })
      .afterClosed()
      .subscribe((pacienteActualizado) => {
        if (pacienteActualizado) {
          this.pacienteSeleccionado = pacienteActualizado;
          this.actualizarPaciente();
        }
      });
  }

  toggleFormularioAgregar(): void {
    this.nuevoPaciente = {
      dni: '',
      numSS: '',
      nom: '',
      cognom1: '',
      cognom2: '',
      sexe: '',
      telefono: '',
      nacionalidad: '',
      email: '',
      administratiuId: 0,
      birthDay: '',
      estado: '',
      episodisMedics: [],
    };
    this.dialog
      .open(DialogFormularioComponent, {
        data: this.nuevoPaciente,
      })
      .afterClosed()
      .subscribe((pacienteCreado) => {
        if (pacienteCreado) {
          this.nuevoPaciente = pacienteCreado;
          this.guardarPaciente();
        }
      });
  }

  cerrarFormulario(): void {
    this.pacienteSeleccionado = null;
  }

  // Eliminar paciente
  borrarPaciente(id: string): void {
    this.pacienteService.delete(id).subscribe({
      next: () => {
        this.obtenerPacientes(); // Refrescar la tabla tras borrar
        this.snackbar.showNotification(
          'success',
          'Paciente eliminado correctamente'
        ); // Notificación de éxito
      },
      error: (error: any) => {
        console.error('Error al eliminar el paciente', error);
        this.snackbar.showNotification(
          'error',
          'Error al eliminar el paciente'
        ); // Notificación de error
      },
    });
  }

  // Guardar un nuevo paciente
  guardarPaciente(): void {
    this.pacienteService.post(this.nuevoPaciente).subscribe({
      next: () => {
        this.obtenerPacientes();
        this.cerrarFormulario();
        this.snackbar.showNotification(
          'success',
          'Paciente guardado exitosamente'
        ); // Notificación de éxito
      },
      error: (error: any) => {
        console.error('Error al guardar el paciente', error);
        this.snackbar.showNotification('error', 'Error al guardar el paciente'); // Notificación de error
      },
    });
  }

  actualizarPaciente(): void {
    console.log(this.pacienteSeleccionado); // Para verificar que pacienteSeleccionado no sea null o undefined
    if (this.pacienteSeleccionado) {
      this.pacienteService
        .put(this.pacienteSeleccionado.dni, this.pacienteSeleccionado)
        .subscribe({
          next: () => {
            this.obtenerPacientes();
            this.cerrarFormulario();
            this.snackbar.showNotification(
              'success',
              'Paciente actualizado correctamente'
            ); // Notificación de éxito
          },
          error: (error: any) => {
            console.error('Error al actualizar el paciente', error);
            this.snackbar.showNotification(
              'error',
              'Error al actualizar el paciente'
            ); // Notificación de error
          },
        });
    } else {
      console.error('pacienteSeleccionado no es válido');
    }
  }

  filtrarPacientes(event: { type: string; term: string }): void {
    const { type, term } = event;
    const searchterm = term.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: Paciente, filter: string) => {
      switch (type) {
        case 'dni':
          return (
            data.dni?.toLowerCase().includes(filter.toLowerCase()) ?? false
          );

        case 'numSS':
          return (
            data.numSS?.toLowerCase().includes(filter.toLowerCase()) ?? false
          );

        case 'nom':
          return (
            data.nom?.toLowerCase().includes(filter.toLowerCase()) ?? false
          );

        case 'sexe':
          return (
            data.sexe?.toLowerCase().includes(filter.toLowerCase()) ?? false
          );

        default:
          return false;
      }
    };
    this.dataSource.filter = searchterm;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
