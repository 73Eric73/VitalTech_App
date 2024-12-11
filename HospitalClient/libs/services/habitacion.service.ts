import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habitacion } from '../interfaces/habitacion.interface';
import { BaseService } from './abstract-service.service';

@Injectable({
  providedIn: 'root',
})
export class HabitacionService extends BaseService<Habitacion, number> {
  protected apiUrl = 'https://localhost:7200/api/Habitacio';

  constructor(http: HttpClient) {
    super(http);
  }
}
