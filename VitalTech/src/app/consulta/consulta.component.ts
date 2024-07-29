import { RouterLinkActive, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ConsultaService } from './consulta.service';

interface Consulta {
  id: number;
  urgencia: string;
  sintomatologia: string;
  recepta: string;
  personalId: string;
  episodiMedicId: number;
}

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css'
})

export class ConsultaComponent {

  consultes: Consulta[] = [];

  constructor(private consultaService: ConsultaService) { }

  ngOnInit() {
    this.loadConsultes();
  }

  loadConsultes(): void {
    this.consultaService.getConsultes().subscribe(data => {
      this.consultes = data;
    });
  }

}
