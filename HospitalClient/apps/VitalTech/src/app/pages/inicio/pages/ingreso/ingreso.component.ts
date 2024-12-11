import { Component, OnInit } from '@angular/core';
import { IngresoService } from '../../../../../../../../libs/services/ingreso.service';
import { Ingreso } from '../../../../../../../../libs/interfaces/ingreso.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingres',
  templateUrl: './ingreso.component.html',
  styleUrl: './ingreso.component.css',
})
export class IngresoComponent {
  searchCriteria: string = 'id';
  searchInput: string = '';

  ingressos: Ingreso[] = [];
  originalIngressos: Ingreso[] = [];

  pagedIngress: Ingreso[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 4;

  constructor(private ingresService: IngresoService, private router: Router) {}

  ngOnInit() {
    this.loadIngres();
  }

  loadIngres(): void {
    this.ingresService.getAll().subscribe((data) => {
      this.ingressos = data;
      this.originalIngressos = data;
      this.totalPages = Math.ceil(this.ingressos.length / this.itemsPerPage);
      this.updatedPage();
    });
  }

  updatedPage(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedIngress = this.ingressos.slice(startIndex, endIndex);

    if (this.ingressos.length == 0) {
      return;
    }

    if (this.pagedIngress.length == 0) {
      this.currentPage = this.currentPage - 1;
      this.loadIngres();
    }
  }

  updateIngres(idIngres: number) {
    this.router.navigate(['/inicio/ingreso/modif-ingreso', idIngres]);
  }

  deleteIngres(id: number) {
    Swal.fire({
      title: 'Eliminar ingreso',
      text: '¿Quieres borrar este ingreso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ingresService.delete(id).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Ingreso eliminado',
              text: 'El ingreso ha sido eliminado con éxito.',
            });
            if (this.pagedIngress.length === 0) {
              this.currentPage--;
            }
            this.loadIngres();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error, no se puede eliminar este ingreso.',
            });
          },
        });
      }
    });
  }

  search(): void {
    if (this.searchInput.trim() === '') {
      this.loadIngres();
      return;
    }

    this.ingressos = this.originalIngressos;
    let busqueda: Ingreso[] = [];

    switch (this.searchCriteria) {
      case 'id':
        for (let i = 0; i < this.ingressos.length; i++) {
          if (this.ingressos[i].id === Number(this.searchInput)) {
            busqueda.push(this.ingressos[i]);
          }
        }
        break;
      case 'entrada':
        for (let i = 0; i < this.ingressos.length; i++) {
          const data = (String) (this.ingressos[i].dataEntrada)
          
          if (data.toLowerCase().includes(this.searchInput.toLowerCase())) {
            busqueda.push(this.ingressos[i]);
          }
        }
        break;
      case 'sortida':
        for (let i = 0; i < this.ingressos.length; i++) {
          if (
            (String) (this.ingressos[i].dataSortida)
              .toLowerCase()
              .includes(this.searchInput.toLowerCase())
          ) {
            busqueda.push(this.ingressos[i]);
          }
        }
        break;
      case 'episodi':
        for (let i = 0; i < this.ingressos.length; i++) {
          if (this.ingressos[i].episodiMedicId === Number(this.searchInput)) {
            busqueda.push(this.ingressos[i]);
          }
        }
        break;
      case 'llit':
        for (let i = 0; i < this.ingressos.length; i++) {
          if (
            (String) (this.ingressos[i].codiLlit) == this.searchInput.toLowerCase()
          ) {
            busqueda.push(this.ingressos[i]);
          }
        }
        break;
    }

    this.ingressos = busqueda;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.ingressos.length / this.itemsPerPage);
    this.updatedPage();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatedPage();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatedPage();
    }
  }

  firstPage(): void {
    if (this.currentPage > 1) {
      this.currentPage = 1;
      this.updatedPage();
    }
  }

  lastPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.totalPages;
      this.updatedPage();
    }
  }
}
