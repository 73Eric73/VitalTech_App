import { Component } from '@angular/core';
import { Cama } from '../../../../../../../../libs/interfaces/cama.interface';
import { CamaService } from '../../../../../../../../libs/services/cama.service';
import { IngressosPopupComponent } from '../../../../components/pop-ups/ingressos-popup/ingressos-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cama',
  templateUrl: './cama.component.html',
  styleUrl: './cama.component.css',
})
export class CamaComponent {
  llits: Cama[] = [];
  originalLlit: Cama[] = [];
  searchCriteria: string = 'ocupat';
  searchInput: string = '';

  pagedLlits: Cama[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 4;

  constructor(
    public dialog: MatDialog,
    private llitService: CamaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLlits();
  }

  loadLlits(): void {
    this.llitService.getAll().subscribe((data) => {
      this.llits = data;
      this.originalLlit = data;
      this.totalPages = Math.ceil(this.llits.length / this.itemsPerPage);
      this.updatePage();
    });
  }

  updatePage(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedLlits = this.llits.slice(startIndex, endIndex);

    if (this.llits.length == 0) {
      return;
    }

    if (this.pagedLlits.length == 0) {
      this.currentPage = this.currentPage - 1;
      this.loadLlits();
    }
  }

  openIngressos(episodi: any): void {
    this.dialog.open(IngressosPopupComponent, {
      data: { ingressos: episodi.ingressos },
      width: '80vw',
      height: '70vh',
      maxWidth: '1000px',
      maxHeight: '500px',
    });
  }

  searchLlit(): void {
    if (this.searchInput.trim() === '') {
      this.loadLlits();
      return;
    }

    this.llits = this.originalLlit;

    let busqueda: Cama[] = [];

    switch (this.searchCriteria) {
      case 'idLlit':
        for (let i = 0; i < this.llits.length; i++) {
          if (
            this.llits[i].codiLlit
              .toLowerCase()
              .includes(this.searchInput.toLowerCase())
          ) {
            busqueda.push(this.llits[i]);
          }
        }
        break;
      case 'ocupat':
        for (let i = 0; i < this.llits.length; i++) {
          if (
            this.searchInput.toLowerCase() === 'si' &&
            this.llits[i].ocupat == true
          ) {
            busqueda.push(this.llits[i]);
          }
          if (
            this.searchInput.toLowerCase() === 'no' &&
            this.llits[i].ocupat == false
          ) {
            busqueda.push(this.llits[i]);
          }
        }
        break;
      case 'idHabitacion':
        for (let i = 0; i < this.llits.length; i++) {
          if (Number(this.searchInput) === this.llits[i].codiHabitacio) {
            busqueda.push(this.llits[i]);
          }
        }
        break;
    }

    this.llits = busqueda;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.llits.length / this.itemsPerPage);
    this.updatePage();
  }

  deleteLlit(id: string): void {
    Swal.fire({
      title: 'Eliminar cama',
      text: '¿Quieres borrar esta cama?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.llitService.delete(id).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Cama eliminada',
              text: 'La cama ha sido eliminada con éxito.',
            });
            if (this.pagedLlits.length === 0) {
              this.currentPage--;
            }
            this.loadLlits();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error, no se puede eliminar la cama.',
            });
          },
        });
      }
    });
  }

  modificarLlit(id: string): void {
    this.router.navigate(['/inicio/cama/modif-cama', id]);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  firstPage(): void {
    if (this.currentPage > 1) {
      this.currentPage = 1;
      this.updatePage();
    }
  }

  lastPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.totalPages;
      this.updatePage();
    }
  }
}
