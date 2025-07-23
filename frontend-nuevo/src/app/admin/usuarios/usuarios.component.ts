import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel

@Component({
  selector: 'app-usuarios',
  standalone: true,
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  imports: [CommonModule, FormsModule]  // IMPORTANTE agregar FormsModule aquí
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  montoRecarga: number = 0;  // Necesario si usas [(ngModel)]="montoRecarga"

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    const token = this.auth.obtenerToken();

    this.http.get<any[]>('http://localhost:8000/api/admin/usuarios/', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }).subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: () => {
        alert('Error al cargar usuarios');
      }
    });
  }

  recargarSaldo(usuarioId: number) {
    // Implementa aquí la lógica para recargar saldo
    console.log('Recargando saldo para usuario', usuarioId, 'monto', this.montoRecarga);
  }

  verRetiros(usuarioId: number) {
    const token = this.auth.obtenerToken();

    this.http.get<any[]>(`http://localhost:8000/api/admin/mis-retiros/${usuarioId}/`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }).subscribe({
      next: (retiros) => {
        console.log(`Retiros del usuario ${usuarioId}:`, retiros);
        alert(`🔎 Tiene ${retiros.length} solicitudes de retiro`);
      },
      error: () => {
        alert('❌ Error al obtener los retiros del usuario');
      }
    }); // ✅ Este paréntesis y punto y coma son importantes
  }
}
