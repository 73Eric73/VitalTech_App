import { Ingreso } from './../../../../../../../../../../libs/interfaces/ingreso.interface';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { IngresoService } from '../../../../../../../../../../libs/services/ingreso.service';
import Swal from 'sweetalert2';
import { EpisodiService } from '../../../../../../../../../../libs/services/episodis.service';
import {
  episodioidexists,
  dataIniciValidator,
  ingresoEnCamaModif,
  dataIniciFinalValidator,
  llitIdexists,
  ingresoEnCama,
} from '../../../../../../validator/ingreso/ingreso-validator.validator';
import { CamaService } from '../../../../../../../../../../libs/services/cama.service';

@Component({
  selector: 'app-modif-ingreso',
  templateUrl: './modif-ingreso.component.html',
  styleUrl: './modif-ingreso.component.css',
})
export class ModifIngresoComponent {
  modiIngresForm: FormGroup;
  ingresId: number = 0;
  sysdate: Date = new Date();
  fechaMin: string = '2020-01-01';
  fechaMax: string = '2030-12-30';
  originalCamaId: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private ingresService: IngresoService,
    private router: Router,
    private route: ActivatedRoute,
    private episodiService: EpisodiService,
    private llitService: CamaService
  ) {
    this.ingresId = Number(this.route.snapshot.paramMap.get('id'));

    this.modiIngresForm = this.fb.group(
      {
        dataEntrada: [
          '',
          {
            validators: [Validators.required],
          },
        ],
        dataSortida: [''],
        episodiMedicId: [
          '',
          {
            validators: [Validators.required],
            asyncValidators: [episodioidexists(this.episodiService)],
            updateOn: 'blur',
          },
        ],
        codiLlit: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(4),
              Validators.pattern(/^\d{3}[AB]$/),
            ],
            asyncValidators: [
              llitIdexists(this.llitService),
              ingresoEnCama(this.ingresService),
            ],
            updateOn: 'blur',
          },
        ],
      },
      {
        validators: [dataIniciFinalValidator(), dataIniciValidator()],
      }
    );

    this.ingresService
      .getById(this.ingresId)
      .subscribe((ingreso) => {
        this.originalCamaId = ingreso.codiLlit;

        const llitControl = this.modiIngresForm.get('llitId'); // guardo su control(campo)
        if (llitControl) {
          // si existe
          llitControl.setAsyncValidators([
            llitIdexists(this.llitService),
            ingresoEnCamaModif(this.ingresService, this.originalCamaId),
          ]); //valida primero que la cama existe y despues si esta ocupada
          llitControl.updateValueAndValidity(); // vuelve a validar todo
        }
      });
  }
  formatearFecha(fecha: Date): string {
    const any = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${any}-${mes}-${dia}`;
  }

  ngOnInit(): void {
    this.ingresId = Number(this.route.snapshot.paramMap.get('id'));
    this.ingresService
      .getById(this.ingresId)
      .subscribe((consulta) => {
        consulta.dataEntrada = consulta.dataEntrada;

        if (consulta.dataSortida != null) {
          consulta.dataSortida = consulta.dataSortida;
        }

        this.modiIngresForm.patchValue(consulta);
      });
    this.fechaMax = this.formatearFecha(this.sysdate);
    this.fechaMin = this.formatearFecha(
      new Date(this.sysdate.getTime() - 432000000)
    );
  }

  onUpdate(): void {

    if (this.modiIngresForm.invalid) {
      this.modiIngresForm.markAllAsTouched();
      return;
    }

    if (this.modiIngresForm.valid) {

      const updatedIngres = {...this.modiIngresForm.getRawValue(), id: this.ingresId};

      this.ingresService.put(updatedIngres.codiLlit , updatedIngres).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Ingreso modificado',
            text: 'El ingreso se ha modificado correctamente.',
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ERROR, campos no válidos.',
          });
        },
      });
    }
  }
}
