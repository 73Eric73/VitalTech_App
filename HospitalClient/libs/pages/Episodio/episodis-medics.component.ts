import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { EpisodiMedic } from '../../../libs/interfaces/episodis-medics.interface';
import { SnackbarComponent } from '../../../apps/GoldenFold/src/app/components/snackbar/snackbar.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { EpisodiService } from '../../../libs/services/episodis.service';
import { DialogFormularioEpisodisModifComponent } from '../../forms/Episodio/Modif/dialog-formulario-episodis-modif.component';
import { DialogFormularioEpisodisComponent } from '../../forms/Episodio/Create/dialog-formulario-episodis.component';
import { ConsultasDialogComponent } from '../../popups/consultas-popup';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-episodis-medics',
  templateUrl: './episodis-medics.component.html',
  styleUrls: [],
})

export class EpisodisMedicsComponent implements OnInit, AfterViewInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<EpisodiMedic> =
    new MatTableDataSource<EpisodiMedic>([]);

  totalItems = 0;
  itemsPerPage = 300;
  pageIndex = 0;

  isPortVitalTech = false;

  episodis: EpisodiMedic[] = [];
  addingEpisodi;
  episodiSeleccionada: EpisodiMedic | null = null;
  noti: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private episodiService: EpisodiService,
    public dialog: MatDialog,
  ) {
    
    this.addingEpisodi = {
      id: 0,
      dataObertura: '',
      dataTancament: '',
      motivo: '',
      urgencia: '',
      recepta: '',
      estat: '',
      dniPacient: '',
      dniMetge: '',
      pruebasDiagnosticas: [],
      ingresos: [],
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.obtenerEpisodis();
    const currentPort = window.location.port;
    let cssPath: string[];

    this.isPortVitalTech = currentPort === '4200';

    if (currentPort == '4201'){
      cssPath = ['/assets/styles/styles.css', '/assets/styles/Episodio/episodis-medics.component.css'];
      this.displayedColumns = [
        'id',
        'dataObertura',
        'dataTancament',
        'motivo',
        'urgencia',
        'recepta',
        'estat',
        'dniPacient',
        'dniMetge',
        'pruebasDiagnosticas',
        'acciones',
      ];
      
    } else {
      cssPath = ['/assets/styles/styles.css', '/assets/styles/Episodio/episodio.component.css'];
      this.displayedColumns = [
        'id',
        'dataObertura',
        'dataTancament',
        'motivo',
        'urgencia',
        'estat',
        'pruebasDiagnosticas',
        'acciones',
      ];
    }

    cssPath.forEach(css => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = css;
      document.head.appendChild(link);
    });
  }

  verConsultas(episodi: any): void {
    this.dialog.open(ConsultasDialogComponent, {
      width: '1200px',
      data: episodi.pruebasDiagnosticas,
    });
  }

  /*verIngresos(episodi: any): void {
    this.dialog.open(IngresosDialogComponent,{
      width: '1200px',
      data: episodi.ingressos
    });
  }*/

  obtenerEpisodis(): void {
    this.episodiService.getAll().subscribe({
      next: (data: EpisodiMedic[]) => {
        this.episodis = data;
        this.episodis.forEach((element) => {
          if (element.dataObertura)
            element.dataObertura = element.dataObertura.split('T')[0];
          if (element.dataTancament)
            element.dataTancament = element.dataTancament.split('T')[0];
        });

        this.totalItems = data.length;
        this.actualizarPagina(0, this.itemsPerPage);
      },
      error: (error: any) => {
        console.error('Error al obtener los episodis', error);
      },
    });
  }

  actualizarPagina(pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.dataSource.data = this.episodis.slice(startIndex, endIndex);
  }

  onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.actualizarPagina(this.pageIndex, this.itemsPerPage);
  }

  toggleFormularioAgregar(): void {
    this.addingEpisodi = {
      id: 0,
      dataObertura: '',
      dataTancament: '',
      motivo: '',
      urgencia: '',
      recepta: '',
      estat: '',
      dniPacient: '',
      dniMetge: '',
      pruebasDiagnosticas: [],
      ingresos: [],
    };
    this.dialog
      .open(DialogFormularioEpisodisComponent, {
        data: this.addingEpisodi,
      })
      .afterClosed()
      .subscribe((episodiCreado) => {
        if (episodiCreado) {
          this.addingEpisodi = episodiCreado;
          this.guardarEpisodi();
        }
      });
  }

  toggleActualizarEpisodi(episodi: EpisodiMedic): void {
    if(this.isPortVitalTech){
      // esta ruta creo que no funcionara
      window.location.href = `https://localhost:4200/inicio/episodio/modif-episodio/${episodi.id}`;
    }else {
      this.episodiSeleccionada = { ...episodi };
      this.dialog
        .open(DialogFormularioEpisodisModifComponent, {
          data: this.episodiSeleccionada,
        })
        .afterClosed()
        .subscribe((episodiActualizado) => {
          if (episodiActualizado) {
            this.episodiSeleccionada = episodiActualizado;
            this.actualizarEpisodi();
          }
        });
    }
  }

  navigateToRegistroEpisodio(): void {
    window.location.href = 'https://localhost:4200/inicio/episodio/registro-episodio';
  }

  cerrarFormulario(): void {
    this.episodiSeleccionada = null;
  }

  guardarEpisodi(): void {
    this.episodiService.post(this.addingEpisodi).subscribe({
      next: () => {
        this.obtenerEpisodis();
        this.cerrarFormulario();
        this.snackbar.showNotification(
          'success',
          'Episodi guardado exitosamente'
        );
      },
      error: (error: any) => {
        console.error('Error al guardar el episodi', error);
        this.snackbar.showNotification('error', 'Error al guardar el episodi');
      },
    });
  }

  borrarEpisodi(id: number): void {
    if (this.isPortVitalTech){
      Swal.fire({
        title: 'Eliminar episodio médico',
        text: '¿Quieres borrar este episodio médico?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.episodiService.delete(id).subscribe({
            next: (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Episodio médico eliminado',
                text: 'El episodio médico ha sido eliminado con éxito.',
              });
              this.obtenerEpisodis();
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error, no se puede eliminar este episodio médico: todavía existen consultas o ingresos.',
              });
            },
          });
        }
      });
    } else {
      this.episodiService.delete(id).subscribe({
        next: () => {
          this.obtenerEpisodis();
          this.snackbar.showNotification(
            'success',
            'Episodi eliminado correctamente'
          );
        },
        error: (error: any) => {
          console.error('Error al eliminar el episodi', error);
          this.snackbar.showNotification('error', 'Error al eliminar el episodi');
        },
      });
    }
  }

  actualizarEpisodi(): void {
    if (this.episodiSeleccionada) {
      this.episodiService
        .put(this.episodiSeleccionada.id, this.episodiSeleccionada)
        .subscribe({
          next: () => {
            this.obtenerEpisodis();
            this.cerrarFormulario();
            this.snackbar.showNotification(
              'success',
              'Episodi actualizado correctamente'
            );
          },
          error: (error: any) => {
            console.error('Error al actualizar el episodi', error);
            this.snackbar.showNotification(
              'error',
              'Error al actualizar el episodi'
            );
          },
        });
    } else {
      console.error('Episodi seleccionada no es válida');
    }
  }

  filtrarEpisodis(event: { type: string; term: string }): void {
    const { type, term } = event;
    const searchterm = term.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: EpisodiMedic, filter: string) => {
      switch (type) {
        case 'dataObertura':
          return data.dataObertura?.toLowerCase().includes(filter) ?? false;
        case 'dataTancament':
          return data.dataTancament?.toLowerCase().includes(filter) ?? false;
        case 'estat':
          return data.estat?.toLowerCase().includes(filter) ?? false;
        case 'dniPacient':
          return data.dniPacient?.toLowerCase().includes(filter) ?? false;
        case 'id':
          return data.id?.toString().includes(filter) ?? false;
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
