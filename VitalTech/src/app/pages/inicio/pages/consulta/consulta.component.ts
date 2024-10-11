import { Component } from '@angular/core';
import { ConsultaService } from '../../../../service/consulta.service';
import { Consulta } from '../../../../interface/consulta.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import Fuse from 'fuse.js';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css',
})
export class ConsultaComponent {

  fuse: Fuse<Consulta> | null = null;

  constructor(
    private consultaService: ConsultaService,
    private router: Router
  ) {}

  consultes: Consulta[] = [];
  protected searchId: number = 1;
  pagedConsultes: Consulta[] = []; // Array para consultas paginadas
  searchCriteria: string = 'dni'; // Inicializamos con un valor por defecto
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;
  searchInput: string = '';
  originalConsultes: Consulta[] = [];

  ngOnInit() {
    this.loadConsultes();
  }

  loadConsultes(): void {
    this.consultaService.getConsultes().subscribe((data) => {
      this.consultes = data;
      this.originalConsultes = data;
      this.totalPages = Math.ceil(this.consultes.length / this.itemsPerPage);
      this.updatePagedConsultes();
    });
  }

  updatePagedConsultes(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedConsultes = this.consultes.slice(startIndex, endIndex);

    if (this.consultes.length === 0) {
      return;
    }

    if (this.pagedConsultes.length === 0) {
      this.currentPage = this.currentPage - 1;
      this.loadConsultes();
    }
  }

  deleteConsulta(id: number): void {
    Swal.fire({
      title: 'Eliminar consulta',
      text: '¿Quieres borrar esta consulta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.consultaService.deleteConsulta(id).subscribe({
          next: () => {
            Swal.fire(
              'Consulta eliminada',
              'La consulta ha sido eliminada con éxito.',
              'success'
            );
            if (this.pagedConsultes.length === 0) {
              this.currentPage--;
            }
            this.loadConsultes();
          },
          error: () => {
            Swal.fire(
              'Error',
              'No se puede eliminar este episodio médico: todavía existen consultas o ingresos.',
              'error'
            );
          },
        });
      }
    });
  }

  modificarConsulta(id: number): void {
    this.router.navigate(['/inicio/consulta/modif-consulta', id]);
  }

  searchConsulta(): void {
    if (this.searchInput.trim() === '') {
      this.loadConsultes();
      return;
    }

    this.fuse = new Fuse(this.originalConsultes, {
      keys: [this.searchCriteria],
      threshold: 0.3,
    });

    const result = this.fuse.search(this.searchInput);
    this.consultes = result.map((res) => res.item);

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.consultes.length / this.itemsPerPage);
    this.updatePagedConsultes();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedConsultes();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedConsultes();
    }
  }

  firstPage(): void {
    if (this.currentPage > 1) {
      this.currentPage = 1;
      this.updatePagedConsultes();
    }
  }

  lastPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.totalPages;
      this.updatePagedConsultes();
    }
  }
}
