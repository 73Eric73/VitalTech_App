import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medico } from '../interfaces/medico.interface';
import { BaseService } from './abstract-service.service';

@Injectable({
  providedIn: 'root',
})
export class MedicoService extends BaseService<Medico, string> {
  protected apiUrl = 'https://localhost:7200/api/Metge';

  constructor(http: HttpClient) {
    super(http);
  }
}
