import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuari } from '../interface/usuari.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  
  private apiUrl = 'https://localhost:7200/api/Personal';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Personal[]> {
    return this.http.get<Personal[]>(this.apiUrl);
  }

  addUsuario(usuario: Personal): Observable<Personal> {
    return this.http.post<Personal>(`${this.apiUrl}/`, usuario);
  }

  updateUsuario(usuario: Personal, dni: string): Observable<Personal> {
    return this.http.put<Personal>(`${this.apiUrl}/${dni}`, usuario);
  }

  deleteUsuario(dni: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dni}`);
  }
}
