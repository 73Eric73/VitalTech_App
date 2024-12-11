import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-consultas-dialog',
  standalone: true,
  imports: [CommonModule, MatTableModule,MatTableModule,
    MatDialogModule],
  template: `
    <h1>Consultas</h1>

    <div class="table-container">
      <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>Id</th>
          <td mat-cell *matCellDef="let element">{{ element.id }}</td>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="urgencia">
          <th mat-header-cell *matHeaderCellDef>Urgencia</th>
          <td mat-cell *matCellDef="let element">
            {{ element.urgencia ? 'Si' : 'No' }}
          </td>
        </ng-container>

        <!-- Weight Column -->
        <ng-container matColumnDef="sintomatologia">
          <th mat-header-cell *matHeaderCellDef>Sintomatologia</th>
          <td mat-cell *matCellDef="let element">
            {{ element.sintomatologia }}
          </td>
        </ng-container>

        <!-- Symbol Column -->
        <ng-container matColumnDef="recepta">
          <th mat-header-cell *matHeaderCellDef>Recepta</th>
          <td mat-cell *matCellDef="let element">{{ element.recepta }}</td>
        </ng-container>

        <ng-container matColumnDef="dniPersonal">
          <th mat-header-cell *matHeaderCellDef>DNI Personal</th>
          <td mat-cell *matCellDef="let element">{{ element.dniPersonal }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `,
  styleUrls: ['./custom-table.component.css'],
})
export class ConsultasDialogComponent {
  dataSource: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any[]) {
    this.dataSource = data;
  }

  displayedColumns: string[] = [
    'id',
    'urgencia',
    'sintomatologia',
    'recepta',
    'dniPersonal',
  ];
}
