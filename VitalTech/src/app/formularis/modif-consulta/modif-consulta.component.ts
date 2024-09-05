import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modif-consulta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modif-consulta.component.html',
  styleUrl: './modif-consulta.component.css'
})
export class ModifConsultaComponent {
  consultaForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient){
    this.consultaForm = this.fb.group({
      urgencia: [''],
      sintomatologia: [''],
      recepta: [''],
      personalId: [''],
      episodiMedicId: ['']
    });
  }

  onSubmit(){
    const consultaData = this.consultaForm.value;

    this.http.post('http://localhost:5296/api/Consulta', consultaData).subscribe({
      next: response => console.log('Consulta registrada:', response),
      error: error => alert('ERROR, camps no valids'),
      complete: () => alert('Operacio completada')
    })
  }

}
