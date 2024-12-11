import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medico } from '../interfaces/medico.interface';
import { PruebaDiagnostica } from '../interfaces/pruebas-diagnosticas.interface';
import { BaseService } from './abstract-service.service';

@Injectable({
  providedIn: 'root',
})
export class PruebasService extends BaseService<PruebaDiagnostica, number> {
  protected apiUrl = 'https://localhost:7200/api/PruebasDiagnosticas';

  constructor(http: HttpClient) {
    super(http);
  }
}
