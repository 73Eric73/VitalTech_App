import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cama } from '../interfaces/cama.interface';
import { BaseService } from './abstract-service.service';

@Injectable({
  providedIn: 'root',
})
export class CamaService extends BaseService<Cama, string> {
  protected apiUrl = 'https://localhost:7200/api/Llit';

  constructor(http: HttpClient) {
    super(http);
  }
}
