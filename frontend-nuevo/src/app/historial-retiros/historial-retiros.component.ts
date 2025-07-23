import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-historial-retiros',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historial-retiros.component.html',
  styleUrls: ['./historial-retiros.component.css']
})
export class HistorialRetirosComponent {
  retiros: any[] = [];

  constructor(private http: HttpClient) {
    this.cargarRetiros();
  }

  cargarRetiros() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:8000/api/usuarios/mis-retiros/', { headers }).subscribe({
      next: (data) => {
        this.retiros = data;
      },
      error: (error) => {
        console.error('Error al cargar historial de retiros:', error);
        alert('❌ Error al cargar historial de retiros');
      }
    });
  }
}
