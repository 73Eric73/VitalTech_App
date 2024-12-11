import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../interfaces/paciente.interface';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BaseService } from './abstract-service.service';

@Injectable({
  providedIn: 'root',
})
export class PacienteService extends BaseService<Paciente, string> {
  protected apiUrl = 'https://localhost:7200/api/Pacient';

  constructor(http: HttpClient) {
    super(http);
  }
}
