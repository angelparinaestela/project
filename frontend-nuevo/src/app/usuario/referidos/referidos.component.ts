import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-referidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './referidos.component.html',
  styleUrls: ['./referidos.component.css']
})
export class ReferidosComponent implements OnInit {
  referidos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerReferidos();
  }

  obtenerReferidos() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:8000/api/usuarios/referidos/', { headers }).subscribe({
      next: (data) => this.referidos = data,
      error: (err) => console.error('❌ Error al obtener referidos:', err)
    });
  }
}
