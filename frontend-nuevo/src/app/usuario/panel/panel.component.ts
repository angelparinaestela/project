import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-panel',
  standalone: true,
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
  imports: [CommonModule, RouterModule]
})
export class PanelComponent implements OnInit {
  usuario: any = {};
  vipNivel: number = 0;  // ✅ Nivel VIP del usuario
  referidos: any[] = [];

  constructor(
    private router: Router,
    public auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.obtenerPerfil();
  }

  obtenerPerfil() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get('http://localhost:8000/api/usuarios/perfil/', { headers }).subscribe({
      next: (data: any) => {
        this.usuario = data;
        this.vipNivel = data.vip_nivel;  // ✅ Guardar nivel VIP
      },
      error: (error) => {
        console.error('❌ Error al obtener perfil:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  retirarSaldo() {
    this.router.navigate(['/retiro']);
  }

  recargar() {
    this.router.navigate(['/recarga']);
  }

  irAHistorialRetiros() {
    this.router.navigate(['/historial-retiros']);
  }

  verReferidos() {
    this.router.navigate(['/referidos']);
  }
}
