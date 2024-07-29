
import { RouterLinkActive, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MetgeService } from './metge.service';

interface Metge {
  dni: string;
  especialitat: string;
  nom: string;
  consultes: string[];
}

@Component({
  selector: 'app-metge',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './metge.component.html',
  styleUrl: './metge.component.css'
})


export class MetgeComponent {

  metges: Metge[] = [];

  constructor(private metgeService: MetgeService) { }

  ngOnInit() {
    this.loadPersonal();
  }

  loadPersonal(): void {
    this.metgeService.getPersonal().subscribe(data => {
      this.metges = data;
    });
  }

}
