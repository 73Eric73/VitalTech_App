import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IngresService } from '../../../../../../service/ingres.service';
import Swal from 'sweetalert2';
import { EpisodiService } from '../../../../../../service/episodis.service';
import { episodioidexists, dataIniciValidator, llitIdexists } from '../../../../../../validator/ingreso/ingreso-validator.validator';
import { CamasService } from '../../../../../../service/camas.service';

@Component({
  selector: 'app-registro-ingreso',
  templateUrl: './registro-ingreso.component.html',
  styleUrl: './registro-ingreso.component.css'

})

export class RegistroIngresoComponent {

  ingresForm: FormGroup;
  /*sysdate: Date = new Date();
  fechaMin: string = "2020-01-01";
  fechaMax: string = "2030-12-30";*/

  constructor(private fb: FormBuilder, private http: HttpClient, private ingresService: IngresService, private episodiService: EpisodiService, private llitService: CamasService) {
    this.ingresForm = this.fb.group({
      dataEntrada: ['', {
        validators: [Validators.required]
      }],
      dataSortida: [''],
      episodiMedicId: ['', {
        validators: [Validators.required],
        asyncValidators: [episodioidexists(episodiService)],
        updateOn: 'blur'
      }],
      llitId: ['', {
        validators: [Validators.required, Validators.minLength(4), Validators.pattern(/^\d{3}[AB]$/)],
        asyncValidators: [llitIdexists(llitService)],
        updateOn: 'blur'
      }]
    }, {
      validators: [dataIniciValidator()]
    });
  }
  
  /*formatearFecha(fecha: Date): string {
    const any = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${any}-${mes}-${dia}`;
  }

  ngOnInit() {
    this.fechaMax = this.formatearFecha(this.sysdate);
    this.fechaMin = this.formatearFecha(new Date(this.sysdate.getTime() - 432000000));
  }*/

  onSubmit() {
    const ingresData = this.ingresForm.value;
    

    /*if (new Date(ingresData.dataEntrada) > new Date()) {
      Swal.fire({
        icon: 'error',
        title: 'No se puede registrar el ingreso',
        text: 'La fecha de entrada del ingreso es posterior a la fecha actual.'
      });
      return;
    }*/

    this.http.post('http://localhost:5296/api/Ingres', ingresData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          title: 'Ingreso registrado',
          text: 'El ingreso se ha registrado correctamente.'
        });
      },
      error: error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'ERROR, campos no válidos.'
        });
      },
      complete: () => {
        Swal.fire({
          icon: 'info',
          title: 'Operación completada',
          text: 'La operación ha finalizado.'
        });
      }
    });



  }

}
