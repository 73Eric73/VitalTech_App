import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CamaService } from '../../services/cama.service';
import { Cama } from '../../interfaces/cama.interface';
import { SnackbarComponent } from '../../../apps/GoldenFold/src/app/components/snackbar/snackbar.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DialogFormulariocamaComponent } from '../../../apps/GoldenFold/src/app/components/Formularios/Cama/dialog-formulario-cama-registro/dialog-formulario-cama.component';
import { DialogFormulariocamaModifComponent } from '../../../apps/GoldenFold/src/app/components/Formularios/Cama/dialog-formulario-cama-modif/dialog-formulario-cama-modif.component';
import { HabitacionService } from '../../services/habitacion.service';
import { Habitacion } from '../../interfaces/habitacion.interface';
@Component({
  selector: 'app-camas',
  templateUrl: './camas.component.html',
  styleUrls: [],
})
export class CamasComponent implements OnInit, AfterViewInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;
  displayedColumns: string[] = [
    'codiLlit',
    'ocupat',
    'foraDeServei',
    'codiHabitacio',
    'acciones',
  ];
  dataSource: MatTableDataSource<Cama> = new MatTableDataSource<Cama>([]);
  totalItems = 0;
  itemsPerPage = 300;
  pageIndex = 0;

  camas: Cama[] = [];
  nuevaCama: Cama;
  notificacion: string | null = null;
  //camasFiltradas: Cama[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  camaSeleccionada: Cama | null = null;

  //puerto actual
  currentPort!: string;
  //booleano para facilitar legibilidad
  isPortGolden!: boolean;

  constructor(
    private camaService: CamaService,
    public dialog: MatDialog,
    private http: HttpClient,
    private habitacionService: HabitacionService
  ) {
    //cambiar html
    this.currentPort = window.location.port;
    this.isPortGolden = this.currentPort==="4201";
    
    

    this.nuevaCama = {
      codiLlit: '',
      ocupat: false,
      foraDeServei: false,
      codiHabitacio: 0,
      ingressos: [],
    };
  }

  /*nuevaCama: Cama = {
    codiLlit: '',
    ocupat: false,
    foraDeServei: false,
    codiHabitacio: 0,
    ingressos: []
  };*/
  //camaParaActualizar: Cama | null = null;

  /*paginaActual: number = 1;
  camasPorPagina: number = 10;
  totalPaginas: number = 0;

  mostrarFormularioAgregarCama: boolean = false;
  mostrarFormularioActualizarCama: boolean = false;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  filtroUbicacion: string = '';
  filtroEstado: string = '';
  filtroTipo: string = '';*/

  //constructor(private camaService: CamaService) {}
  ngOnInit(): void {
    this.obtenerCamas();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerCamas(): void {
    this.camaService.getAll().subscribe({
      next: (data: Cama[]) => {
        this.camas = data;
        this.totalItems = data.length;
        this.actualizarPagina(0, this.itemsPerPage);
        console.log(this.camas);
      },
      error: (error: any) => {
        console.error('Error al obtener las camas', error);
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
    this.dataSource.data = this.camas.slice(startIndex, endIndex);
  }

  // Mostrar el formulario para actualizar paciente
  toggleActualizarCama(cama: Cama): void {
    this.camaSeleccionada = { ...cama };
    this.dialog
      .open(DialogFormulariocamaModifComponent, {
        data: this.camaSeleccionada,
      })
      .afterClosed()
      .subscribe((camaActualizada) => {
        if (camaActualizada) {
          this.camaSeleccionada = camaActualizada;
          this.actualizarCama(cama.codiLlit);
        }
      });
  }

  toggleFormularioAgregar(): void {
    this.nuevaCama = {
      codiLlit: '',
      ocupat: false,
      foraDeServei: false,
      codiHabitacio: 0,
      ingressos: [],
    };
    this.dialog
      .open(DialogFormulariocamaComponent, {
        data: this.nuevaCama,
      })
      .afterClosed()
      .subscribe((camaCreada) => {
        if (camaCreada) {
          this.nuevaCama = camaCreada;
          this.guardarCama();
        }
      });
  }
  cerrarFormulario(): void {
    this.camaSeleccionada = null;
  }

  borrarCama(codiLlit: string): void {
    this.camaService.delete(codiLlit).subscribe({
      next: () => {
        this.obtenerCamas(); // Refrescar la tabla tras borrar
        this.snackbar.showNotification(
          'success',
          'Cama eliminada correctamente'
        ); // Notificación de éxito
      },
      error: (error: any) => {
        console.error('Error al eliminar la cama', error);
        this.snackbar.showNotification('error', 'Error al eliminar la cama'); // Notificación de error
      },
    });
  }
  // Guardar un nuevo paciente
  guardarCama(): void {
    console.log(this.nuevaCama.toString());
    this.http.post('http://localhost:5296/api/Llit', this.nuevaCama).subscribe({
      next: () => {
        this.obtenerCamas();
        this.cerrarFormulario();
        this.snackbar.showNotification('success', 'Cama guardada exitosamente'); // Notificación de éxito
      },
      error: (error: any) => {
        console.error('Error al guardar la cama', error);
        this.snackbar.showNotification('error', 'Error al guardar la cama'); // Notificación de error
      },
    });
  }
  actualizarCama(codiLlit: string): void {
    console.log(this.camaSeleccionada); // Para verificar que pacienteSeleccionado no sea null o undefined
    if (this.camaSeleccionada) {
      this.camaService.put(codiLlit, this.camaSeleccionada).subscribe({
        next: () => {
          this.obtenerCamas();
          this.cerrarFormulario();
          this.snackbar.showNotification(
            'success',
            'Cama actualizada correctamente'
          ); // Notificación de éxito
        },
        error: (error: any) => {
          console.error('Error al actualizar la cama', error);
          this.snackbar.showNotification(
            'error',
            'Error al actualizar la cama'
          ); // Notificación de error
        },
      });
    } else {
      console.error('Cama seleccionada no es válida');
    }
  }

  filtrarCamas(event: { type: string; term: string }): void {
    const { type, term } = event;
    const searchterm = term.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: Cama, filter: string) => {
      switch (type) {
        case 'codiLlit':
          return (
            data.codiLlit?.toLowerCase().includes(filter.toLowerCase()) ?? false
          );

        case 'ocupat':
          if (filter === 'true' || filter === 'false') {
            const filterBoolean = filter === 'true';
            return data.ocupat === filterBoolean;
          }
          if (filter.toLowerCase() === 'si') {
            return data.ocupat === true;
          }
          if (filter.toLowerCase() === 'no') {
            return data.ocupat === false;
          }
          return false;

        case 'foraDeServei':
          if (filter === 'true' || filter === 'false') {
            const filterBoolean = filter === 'true';
            return data.foraDeServei === filterBoolean;
          }
          if (filter.toLowerCase() === 'si') {
            return data.foraDeServei === true;
          }
          if (filter.toLowerCase() === 'no') {
            return data.foraDeServei === false;
          }
          return false;

        case 'codiHabitacio':
          return data.codiHabitacio.toString().toLowerCase() === filter;

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
