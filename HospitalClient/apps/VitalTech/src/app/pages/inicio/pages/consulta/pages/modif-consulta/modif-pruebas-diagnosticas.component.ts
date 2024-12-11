import { PruebasService } from './../../../../../../../../../../libs/services/pruebas.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PruebaDiagnostica } from '../../../../../../../../../../libs/interfaces/pruebas-diagnosticas.interface';
import Swal from 'sweetalert2';
import { MedicoService } from '../../../../../../../../../../libs/services/metge.service';
import {
  personalidValidator,
  episodiidValidator,
  personalDniLetraCorrect,
} from '../../../../../../validator/consulta/consulta-validator.validator';
import { EpisodiService } from '../../../../../../../../../../libs/services/episodis.service';

@Component({
  selector: 'app-modif-consulta',
  templateUrl: './modif-pruebas-diagnosticas.component.html',
  styleUrl: './modif-pruebas-diagnosticas.component.css',
})
export class ModifConsultaComponent {
  consultaForm: FormGroup;
  consultaId: number = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private consultaService: PruebasService,
    private router: Router,
    private route: ActivatedRoute,
    private personalService: MedicoService,
    private episodiService: EpisodiService
  ) {
    this.consultaForm = this.fb.group(
      {
        id: [{ value: '', disabled: true }],
        urgencia: [''],
        sintomatologia: [
          '',
          {
            validators: [Validators.required],
          },
        ],
        recepta: [
          '',
          {
            validators: [Validators.required],
          },
        ],
        dniPersonal: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(9),
              Validators.pattern(/^\d{8}[A-Za-z]$/),
            ],
            asyncValidators: [personalidValidator(this.personalService)],
          },
        ],
        episodiMedicId: [
          '',
          {
            validators: [Validators.required],
            asyncValidators: [episodiidValidator(this.episodiService)],
          },
        ],
      },
      {
        validators: personalDniLetraCorrect(),
      }
    );
  }

  ngOnInit(): void {
    this.consultaId = Number(this.route.snapshot.paramMap.get('id')); // obtiene el id de la consulta desde la url
    this.consultaService.getById(this.consultaId).subscribe((consulta) => {
      this.consultaForm.patchValue(consulta);
    });
  }

  onActualice(): void {
    if (this.consultaForm.valid) {
      const updatedConsulta: PruebaDiagnostica = {
        ...this.consultaForm.getRawValue(),
        id: this.consultaId,
      };

      this.consultaService.put(updatedConsulta.id,updatedConsulta).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Consulta modificada',
            text: 'La consulta se ha modificado correctamente.',
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
