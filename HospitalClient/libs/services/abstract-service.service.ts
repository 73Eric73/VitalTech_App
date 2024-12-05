import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class BaseService<TEntity, TKey> {
  protected abstract apiUrl: string;

  constructor(protected http: HttpClient) {}

  getAll(): Observable<TEntity[]> {
    return this.http.get<TEntity[]>(this.apiUrl);
  }

  getById(id: TKey): Observable<TEntity> {
    return this.http.get<TEntity>(`${this.apiUrl}/${id}`);
  }

  post(entity: TEntity): Observable<TEntity> {
    return this.http.post<TEntity>(this.apiUrl, entity);
  }

  put(id: TKey, entity: TEntity): Observable<TEntity> {
    return this.http.put<TEntity>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: TKey): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
