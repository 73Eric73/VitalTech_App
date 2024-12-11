import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Cama } from '../../../../../../../../../../libs/interfaces/cama.interface';
import { CamaService } from '../../../../../../../../../../libs/services/cama.service';
import Swal from 'sweetalert2';
import {
  habidValidator,
  codiLlitHabitacioValidator,
  camaIdValidatorModif,
  camaOcupadaPaciente,
} from '../../../../../../validator/cama/cama-validator.validator';
import { HabitacionService } from '../../../../../../../../../../libs/services/habitacion.service';
import { IngresoService } from '../../../../../../../../../../libs/services/ingreso.service';

@Component({
  selector: 'app-modif-cama',
  templateUrl: './modif-cama.component.html',
  styleUrl: './modif-cama.component.css',
})
export class ModifCamaComponent {
  llitForm: FormGroup;
  llitId: string = '';
  originalCamaId: string | null = null;
  codiLlitGigaOriginal: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private llitService: CamaService,
    private habitacioService: HabitacionService,
    private ingresService: IngresoService
  ) {
    const camaId = this.route.snapshot.paramMap.get('id') || '';
    this.originalCamaId = camaId;

    this.llitForm = this.fb.group(
      {
        codiLlit: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(4),
              Validators.pattern(/^\d{3}[A-B]{1}$/),
            ],
            asyncValidators: [
              camaIdValidatorModif(this.llitService, this.originalCamaId),
            ],
            updateOn: 'blur',
          },
        ],
        foraDeServei: [false],
        codiHabitacio: [
          '',
          {
            validators: [Validators.required, Validators.pattern(/^\d{3}$/)],
            asyncValidators: [habidValidator(this.habitacioService)],
            updateOn: 'blur',
          },
        ],
      },
      {
        validator: [codiLlitHabitacioValidator()],
        asyncValidators: [camaOcupadaPaciente(this.ingresService)],
        updateOn: 'change',
      }
    );
  }

  ngOnInit(): void {
    this.llitId = String(this.route.snapshot.paramMap.get('id')); // obtiene el id de la planta desde la url
    this.llitService.getById(this.llitId).subscribe((llit) => {
      this.llitForm.patchValue(llit);
      this.codiLlitGigaOriginal = llit.codiLlit;
    });
  }

  onActualice(): void {
    if (this.llitForm.invalid) {
      this.llitForm.markAllAsTouched();
      return;
    }
    if (this.llitForm.valid) {
      const updatedLlit: Cama = {
        ...this.llitForm.getRawValue(),
        id: this.llitId,
      };
      this.llitService
        .put(this.codiLlitGigaOriginal, updatedLlit)
        .subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Cama modificada',
              text: 'La cama se ha modificado correctamente.',
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
