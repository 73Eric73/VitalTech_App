import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { Paciente } from '../../../../../../libs/interfaces/paciente.interface';
import { PacienteService } from '../../../../../../libs/services/paciente.service';
import { PruebaDiagnostica } from '../../../../../../libs/interfaces/pruebas-diagnosticas.interface';
import { PruebasService } from '../../../../../../libs/services/pruebas.service';

@Component({
  selector: 'app-pruebas-dialog',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatDialogModule],
  template: `
    <h1 mat-dialog-title>Pruebas diagnosticas</h1>
    <div class="table-container">
      <table
        mat-table
        [dataSource]="purebasDiagnosticas"
        class="mat-elevation-z8"
      >
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>Id</th>
          <td mat-cell *matCellDef="let element">{{ element.id }}</td>
        </ng-container>

        <ng-container matColumnDef="dniMetge">
          <th mat-header-cell *matHeaderCellDef>Medico</th>
          <td mat-cell *matCellDef="let element">{{ element.dniMetge }}</td>
        </ng-container>

        <ng-container matColumnDef="dniEnfermer">
          <th mat-header-cell *matHeaderCellDef>Enfermero</th>
          <td mat-cell *matCellDef="let element">{{ element.dniEnfermer }}</td>
        </ng-container>

        <ng-container matColumnDef="episodiMedicId">
          <th mat-header-cell *matHeaderCellDef>Episodio Medico</th>
          <td mat-cell *matCellDef="let element">
            {{ element.episodiMedicId }}
          </td>
        </ng-container>

        <ng-container matColumnDef="dolencia">
          <th mat-header-cell *matHeaderCellDef>Dolencia</th>
          <td mat-cell *matCellDef="let element">{{ element.dolencia }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `,
  styleUrls: ['./custom-table.component.css'],
})
export class PruebasDialogComponent {
  dataSource: any;
  purebasDiagnosticas!: MatTableDataSource<PruebaDiagnostica>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any[],
    private pruebasService: PruebasService
  ) {
    this.dataSource = data;
    this.purebasDiagnosticas = new MatTableDataSource<PruebaDiagnostica>();
    this.obtenerPruebasDiagnosticas();
  }

  obtenerPruebasDiagnosticas(): void {
    this.pruebasService.getAll().subscribe({
      next: (data: PruebaDiagnostica[]) => {
        // Filter the data based on the ids present in the `data` array
        const filteredData = data.filter((prueba) =>
          this.data.some((item) => item.id === prueba.id)
        );
        this.purebasDiagnosticas.data = filteredData;
        console.log('Pruebas: ', filteredData);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  displayedColumns: string[] = [
    'id',
    'dniMetge',
    'dniEnfermer',
    'episodiMedicId',
    'dolencia',
  ];
}
