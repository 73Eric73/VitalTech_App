import { RouterLinkActive, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Habitacio } from '../../interface/habitacio.interface';
import { HabitacioService } from '../../service/habitaciones.service';
import { LlitsPopupComponent } from '../../pop-ups/llits-popup/llits-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})

export class HabitacionesComponent {

  habitacions: Habitacio[] = [];

  constructor(public dialog: MatDialog, private habService: HabitacioService) { }

  ngOnInit() {
    this.loadHabitacions();

    this.loadHabitacio(301);
  }

  loadHabitacions(): void {
    console.info('1r ' + this.habitacions.length);
    this.habService.getHabitacions().subscribe(data => {
      this.habitacions = data;
      console.info('2r ' + this.habitacions.length);
    });


  }

  loadHabitacio(id: number): void {

    console.info('3r ' + this.habitacions.length);
    
     this.habService.getHabitacio(id).subscribe(data =>
       this.habitacions.splice(0, this.habitacions.length + 1, data));

  }

  openLlits(habitacio: any): void {
    this.dialog.open(LlitsPopupComponent, {
      data: { llits: habitacio.llits },
      width: '80vw',
      height: '70vh',
      maxWidth: '1000px',
      maxHeight: '500px'
    });
  }

}
