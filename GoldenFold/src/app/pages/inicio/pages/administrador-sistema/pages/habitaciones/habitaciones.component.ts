import { Component, OnInit, ViewChild } from '@angular/core';
import { HabitacionService } from '../../../../../../services/habitacion.service';
import { Habitacion } from '../../../../../../interface/habitacion.interface';
import { SnackbarComponent } from '../../../../../../components/snackbar/snackbar.component'; // Importar el componente standalone
import { MatTableDataSource } from '@angular/material/table'; // Módulo de tabla de Angular Material
import { MatPaginator, PageEvent } from '@angular/material/paginator'; // Módulo de paginación de Angular Material
import { MatSort } from '@angular/material/sort'; // Módulo de ordenación de Angular Material
import { MatDialog } from '@angular/material/dialog';
import { CamasDialogComponent } from '../../../../../../components/popups/camas-popup';
import { DialogCrearHabitacionComponent } from '../../../../../../components/Formularios/Habitacion/dialog-crear-habitacion/dialog-crear-habitacion/dialog-crear-habitacion.component';
import { DialogRef } from '@angular/cdk/dialog';
import { DialogActualizarHabitacionComponent } from '../../../../../../components/Formularios/Habitacion/dialog-actualizar-habitacion/dialog-actualizar-habitacion.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css'],
})
export class HabitacionesComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;  // Referencia al snackbar
  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Referencia al paginador de Angular Material
  @ViewChild(MatSort) sort!: MatSort;  // Referencia al orden de Angular Material
  
  displayedColumns: string[] = ['NumeroHabitacion', 'CapCamas', 'Planta', 'Camas', 'Acciones'];  // Columnas de la tabla
  dataSource = new MatTableDataSource<Habitacion>();  // DataSource para la tabla
  
  totalItems = 0;
  itemsPerPage = 300;
  pageIndex = 0;

  nuevaHabitacion: Habitacion;
  habitaciones: Habitacion[] = [];
  notificacion: string | null = null;

  habitacionParaActualizar: Habitacion | null = null;


  constructor(private habitacionService: HabitacionService, public dialog: MatDialog) 
  { 
    this.nuevaHabitacion = {
      codiHabitacio: 0,
      capacitatLlits: 0,
      plantaId: 0,
      llits: ['']
    }
  }

  ngOnInit(): void {
    this.obtenerHabitaciones();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;  // Enlazar el paginador a la tabla
    this.dataSource.sort = this.sort;  // Enlazar la ordenación a la tabla
  }

  obtenerHabitaciones(): void {
    this.habitacionService.getHabitacions().subscribe({
      next: (data: Habitacion[]) => {
        this.habitaciones = data;
        this.totalItems = data.length;
        this.actualizarPagina(0, this.itemsPerPage);
      },
      error: (error: any) => {
        console.error('Error al obtener las habitaciones', error);
        this.snackbar.showNotification('error', 'Error al obtener las habitaciones');  // Mostrar notificación de error
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
    this.dataSource.data = this.habitaciones.slice(startIndex, endIndex);
  }

  toggleFormularioAgregar() {
    this.nuevaHabitacion = {
      codiHabitacio: 0,
      capacitatLlits: 0,
      plantaId: 0,
      llits: ['']
    };

    this.dialog.open(DialogCrearHabitacionComponent, {
      data: this.nuevaHabitacion
    }).afterClosed().subscribe((habitacionCreada) => {
      if(habitacionCreada){
        this.nuevaHabitacion = habitacionCreada;
        this.guardarHabitacion();
      }
    })
  }

  guardarHabitacion() {
    this.habitacionService.postHabitacion(this.nuevaHabitacion).subscribe({
      next: () => {
        this.obtenerHabitaciones();
        this.snackbar.showNotification('success', 'Habitación guardada exitosamente'); // Notificación de éxito
      },
      error: (error: any) => {
        this.snackbar.showNotification('error', 'Error al guardar la habitacion'); // Notificación de error
      }
    });
  }

  verCamas(habitacion: any): void {
    this.dialog.open(CamasDialogComponent, {
      width: '1200px',
      data: habitacion.llits
    });
  }
  

  borrarHabitacion(id : number): void {
    Swal.fire({
      title: 'Eliminar habitación',
      text: "¿Quieres borrar esta habitación?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.habitacionService.deleteHabitacion(id).subscribe({
          next: () => {
            this.obtenerHabitaciones();
            this.snackbar.showNotification('success', 'Habitación eliminada correctamente');
          },
          error: () => {
            console.error('Error al eliminar la habitación');
            this.snackbar.showNotification('error', 'Error al eliminar la habitación');
          }
        });
      }
    });
    
  }

  toggleActualizarHabitacion(habitacion: Habitacion): void {
    this.habitacionParaActualizar = {...habitacion};  // Guardar habitación para actualización
    this.dialog.open(DialogActualizarHabitacionComponent,{
      data: this.habitacionParaActualizar
    }).afterClosed().subscribe((habitacionActualizada) => {
      if (habitacionActualizada) {
        this.habitacionParaActualizar = habitacionActualizada;
        this.modificarHabitacion(habitacion.codiHabitacio);
      }
    })
  }

  modificarHabitacion(id: number): void {
    if(this.habitacionParaActualizar){
      this.habitacionService.putHabitacion(id, this.habitacionParaActualizar).subscribe({
        next: () => {
          this.obtenerHabitaciones();
          this.cerrarFormulario();
          this.snackbar.showNotification('success', 'Habitación actualizada correctamente'); // Notificación de éxito
        },
        error: (error: any) => {
          this.snackbar.showNotification('error', 'Error al actualizar la habitación'); // Notificación de error
        }
    });
  }
}

  cerrarFormulario(): void {
    this.habitacionParaActualizar = null;
  }

  aplicarFiltro(event: {type: string; term: string}): void {
    const {type, term} = event;
    const searchterm = term.trim().toLowerCase();
    
    this.dataSource.filterPredicate = (data: Habitacion, filter: string) => {
      switch (type){
        case 'habitacion':
          return data.codiHabitacio.toString().toLowerCase() === filter;
        case 'capacitat':
          return data.capacitatLlits.toString().toLowerCase() === filter;
          case 'planta':
            return data.plantaId.toString().toLowerCase() === filter;
        default:
          return false;
      }
    };
    this.dataSource.filter = searchterm;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();  // Reiniciar la paginación cuando se aplica el filtro
    }
  }



}
