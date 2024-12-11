import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CamaService } from '../../../../../../../../../../libs/services/cama.service';
import {
  camaidValidator,
  codiLlitHabitacioValidator,
  habidValidator,
} from '../../../../../../validator/cama/cama-validator.validator';
import { HabitacionService } from '../../../../../../../../../../libs/services/habitacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-cama',
  templateUrl: './registro-cama.component.html',
  styleUrl: './registro-cama.component.css',
})
export class RegistroCamaComponent {
  llitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private llitService: CamaService,
    private habitacioService: HabitacionService
  ) {
    this.llitForm = this.fb.group(
      {
        codiLlit: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(4),
              Validators.pattern(/^\d{3}[AB]$/),
            ],
            asyncValidators: [camaidValidator(this.llitService)],
            updateOn: 'blur',
          },
        ],
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
        validator: codiLlitHabitacioValidator(),
      }
    );
  }

  onSubmit() {
    const llitData = { ...this.llitForm.value }; // Copiar los datos del formulario

    // Asegurarse de que el último carácter de codiLlit sea mayúscula
    llitData.codiLlit =
      llitData.codiLlit.slice(0, 3) + llitData.codiLlit[3].toUpperCase();

    this.http.post('http://localhost:5296/api/Llit', llitData).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Cama registrada',
          text: 'La cama se ha registrado correctamente.',
        });
      },
      (error) => {
        if (
          error.status === 400 &&
          error.error === 'No es poden afegir més llits a aquesta habitació.'
        ) {
          this.llitForm.setErrors({ limiteCapacidad: true });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ERROR, campos no válidos.',
          });
        }
      }
    );
  }
}
