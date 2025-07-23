import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tareas-admin',
  standalone: true,
  templateUrl: './tareas-admin.component.html',
  styleUrls: ['tareas-admin.css'],
  imports: [CommonModule, FormsModule]
})
export class TareasAdminComponent implements OnInit {
  usuarios: any[] = [];
  titulo: string = '';
  descripcion: string = '';
  usuario_id: number = 0;

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

  asignarTarea() {
    if (!this.titulo || !this.descripcion || !this.usuario_id) {
      alert('Completa todos los campos');
      return;
    }

    const token = this.auth.obtenerToken();
    const body = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      usuario_id: this.usuario_id
    };

    this.http.post('http://localhost:8000/api/admin/tareas/', body, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }).subscribe({
      next: () => {
        alert('Tarea asignada con éxito');
        this.titulo = '';
        this.descripcion = '';
        this.usuario_id = 0;
      },
      error: () => {
        alert('Error al asignar tarea');
      }
    });
  }
}
