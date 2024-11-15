import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habitacion } from '../interface/habitacion.interface';

@Injectable({
  providedIn: 'root'
})

export class HabitacionService {
  private apiUrl = 'http://localhost:5296/api/Habitacio';

  constructor(private http: HttpClient) { }

  getHabitacions(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.apiUrl);
  }

  getHabitacio(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.apiUrl}/${id}`);
  }

  postHabitacion(Habitacion: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.apiUrl, Habitacion);
  }

  putHabitacion(habitacio: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.apiUrl}/${habitacio.codiHabitacio}`, habitacio);
  }

  deleteHabitacion(id: number): Observable<void> {
    return this.http.delete<any>(this.apiUrl + '/' + id);
  }
}