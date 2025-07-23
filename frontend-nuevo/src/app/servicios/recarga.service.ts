import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  obtenerQrActivo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/qr/`);
  }

  subirVoucher(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/usuarios/recargar/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  listarRecargas(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/usuarios/mis-recargas/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
