import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import {
  pacientIdexists,
  dataIniciValidator,
  buit,
} from '../../../../../../validator/episodio/episodio-validator.validator';
import { PacienteService } from '../../../../../../../../../../libs/services/paciente.service';
import { Paciente } from '../../../../../../../../../../libs/interfaces/paciente.interface';

@Component({
  selector: 'app-registro-episodio',
  templateUrl: './registro-episodio.component.html',
  styleUrl: './registro-episodio.component.css',
})
export class RegistroEpisodiComponent {
  episodiForm: FormGroup;
  pacients: Paciente[] = [];
  dropdownVisible = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private pacienteService: PacienteService
  ) {
    this.episodiForm = this.fb.group(
      {
        dataObertura: [
          '',
          {
            validators: [Validators.required],
          },
        ],
        dataTancament: [''],
        dolencia: [
          '',
          {
            validators: [Validators.required, buit()],
          },
        ],
        estat: [''],
        dniPacient: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(9),
              Validators.pattern(/^\d{8}[A-Za-z]$/),
            ],
            asyncValidators: [pacientIdexists(pacienteService)],
          },
        ],
      },
      {
        validators: dataIniciValidator(),
      }
    );

    this.episodiForm.get('estat')?.valueChanges.subscribe((estat) => {
      if (estat === 'Resuelto') {
        this.episodiForm.addControl(
          'dataTancament',
          this.fb.control(new Date())
        ); // es parecido al setValue, pero como este atrivuto no lo tenemos inicializado en el formulario se usa addControl
      } else {
        this.episodiForm.removeControl('dataTancament');
      }
    });

    this.pacienteService.getAll().subscribe((data) => {
      this.pacients = data;
      this.pacients.sort((a, b) => a.nom.localeCompare(b.nom));
    });
  }

  showDropdown() {
    this.dropdownVisible = true;
  }

  hideDropdown() {
    setTimeout(() => {
      this.dropdownVisible = false;
    }, 200);
  }

  selectPacient(event: Event) {
    const selectedDni = (event.target as HTMLSelectElement).value;
    const selectedPatient = this.pacients.find(
      (pacient) => pacient.dni === selectedDni
    );
    if (selectedPatient) {
      this.episodiForm.get('dniPacient')?.setValue(selectedDni);
    }
  }

  onSubmit() {
    if (this.episodiForm.invalid) {
      this.episodiForm.markAllAsTouched();
      return;
    }
    const episodiData = this.episodiForm.value;
    if (episodiData.estat === null || episodiData.estat === '') {
      episodiData.estat = 'No Resuelto';
    }

    this.http
      .post('http://localhost:5296/api/EpisodiMedic', episodiData)
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Episodio médico registrado',
            text: 'El episodio se ha registrado correctamente.',
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
