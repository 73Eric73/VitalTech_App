import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AdministradorSistema } from '../interfaces/administrador-sistema.interface';
import { BaseService } from './abstract-service.service';

@Injectable({
  providedIn: 'root',
})
export class AdministradorSistemaService extends BaseService<
  AdministradorSistema,
  string
> {
  protected apiUrl = 'https://localhost:7200/api/AdministradorSistema';

  constructor(http: HttpClient) {
    super(http);
  }
}
