import { Medico } from './../../../../../libs/interfaces/medico.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enfermero } from '../interface/enfermer.interface';
import { BaseService } from './abstract-service.service';

@Injectable({
  providedIn: 'root',
})
export class EnfermeroService extends BaseService<Enfermero, string> {
  protected apiUrl = 'https://localhost:7200/api/Enfermer';

  constructor(http: HttpClient) {
    super(http);
  }
}
