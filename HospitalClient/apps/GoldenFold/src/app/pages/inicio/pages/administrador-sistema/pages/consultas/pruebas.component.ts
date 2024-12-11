import { PruebasService } from './../../../../../../../../../../libs/services/pruebas.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SnackbarComponent } from '../../../../../../components/snackbar/snackbar.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DialogFormularioConsultaComponent } from '../../../../../../components/Formularios/Consulta/dialog-formulario-consulta-registro/dialog-formulario-consulta.component';
import { DialogFormularioConsultaModifComponent } from '../../../../../../components/Formularios/Consulta/dialog-formulario-consulta-modif/dialog-formulario-consulta-modif.component';
import { PruebaDiagnostica } from '../../../../../../../../../../libs/interfaces/pruebas-diagnosticas.interface';
@Component({
  selector: 'app-preubas',
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.css'],
})
export class PruebasComponent implements OnInit, AfterViewInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  displayedColumns: string[] = [
    'id',
    'urgencia',
    'sintomatologia',
    'receta',
    'dniPersonal',
    'episodiMedicId',
    'acciones',
  ];
  dataSource: MatTableDataSource<PruebaDiagnostica> =
    new MatTableDataSource<PruebaDiagnostica>([]);

  totalItems = 0;
  itemsPerPage = 300;
  pageIndex = 0;

  pruebas: PruebaDiagnostica[] = [];
  addingPrueba;
  pruebaSeleccionada: PruebaDiagnostica | null = null;

  noti: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private pruebaService: PruebasService,
    public dialog: MatDialog,
    private http: HttpClient
  ) {
    this.addingPrueba = {
      id: 0,
      dniMetge: '',
      dniEnfermer: '',
      episodiMedicId: 0,
      dolencia: '',
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.obtenerConsultas();
  }

  obtenerConsultas(): void {
    this.pruebaService.getAll().subscribe({
      next: (data: PruebaDiagnostica[]) => {
        this.pruebas = data;
        this.totalItems = data.length;
        this.actualizarPagina(0, this.itemsPerPage);
      },
      error: (error: any) => {
        console.error('Error al obtener las consultas', error);
      },
    });
  }

  actualizarPagina(pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.dataSource.data = this.pruebas.slice(startIndex, endIndex);
  }

  onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.actualizarPagina(this.pageIndex, this.itemsPerPage);
  }

  toggleFormularioAgregar(): void {
    this.addingPrueba = {
      id: 0,
      dniMetge: '',
      dniEnfermer: '',
      episodiMedicId: 0,
      dolencia: '',
    };
    this.dialog
      .open(DialogFormularioConsultaComponent, {
        data: this.addingPrueba,
      })
      .afterClosed()
      .subscribe((consultaCreada) => {
        if (consultaCreada) {
          this.guardarConsulta();
        }
      });
  }

  toggleActualizarConsulta(prueba: PruebaDiagnostica): void {
    this.pruebaSeleccionada = { ...prueba };
    this.dialog
      .open(DialogFormularioConsultaModifComponent, {
        data: this.pruebaSeleccionada,
      })
      .afterClosed()
      .subscribe((pruebaActualizada) => {
        if (pruebaActualizada) {
          this.pruebaSeleccionada = pruebaActualizada;
          this.actualizarConsulta();
        }
      });
  }

  cerrarFormulario(): void {
    this.pruebaSeleccionada = null;
  }

  guardarConsulta(): void {
    this.http
      .post('http://localhost:5296/api/Consulta', this.addingPrueba)
      .subscribe({
        next: () => {
          this.obtenerConsultas();
          this.cerrarFormulario();
          this.snackbar.showNotification(
            'success',
            'Consulta guardada exitosamente'
          );
        },
        error: (error: any) => {
          console.error('Error al guardar la consulta', error);
          this.snackbar.showNotification(
            'error',
            'Error al guardar la consulta'
          );
        },
      });
  }

  borrarConsulta(id: number): void {
    this.pruebaService.delete(id).subscribe({
      next: () => {
        this.obtenerConsultas();
        this.snackbar.showNotification(
          'success',
          'Consulta eliminada correctamente'
        );
      },
      error: (error: any) => {
        console.error('Error al eliminar la consulta', error);
        this.snackbar.showNotification(
          'error',
          'Error al eliminar la consulta'
        );
      },
    });
  }

  actualizarConsulta(): void {
    if (this.pruebaSeleccionada) {
      this.pruebaService
        .put(this.pruebaSeleccionada.id, this.pruebaSeleccionada)
        .subscribe({
          next: () => {
            this.obtenerConsultas();
            this.cerrarFormulario();
            this.snackbar.showNotification(
              'success',
              'Consulta actualizada correctamente'
            ); // Notificación de éxito
          },
          error: (error: any) => {
            console.error('Error al actualizar la Consulta', error);
            this.snackbar.showNotification(
              'error',
              'Error al actualizar la Consulta'
            ); // Notificación de error
          },
        });
    } else {
      console.error('Cama seleccionada no es válida');
    }
  }

  filtrarConsultas(event: { type: string; term: string }): void {
    const { type, term } = event;
    const searchterm = term.trim().toLowerCase();

    this.dataSource.filterPredicate = (
      data: PruebaDiagnostica,
      filter: string
    ) => {
      switch (type) {
        case 'urgencia':
          return data.dniMetge?.toLowerCase().includes(filter) ?? false;
        case 'sintomatologia':
          return data.dniEnfermer?.toLowerCase().includes(filter) ?? false;
        case 'receta':
          return data.episodiMedicId?.toString().includes(filter) ?? false;
        case 'dniPersonal':
          return data.dolencia?.toLowerCase().includes(filter) ?? false;
        case 'id':
          return data.id?.toString().includes(filter) ?? false;
        default:
          return false;
      }
    };

    // Aplicar el filtro al dataSource
    this.dataSource.filter = searchterm;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
