import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['../auth-page/shared-auth.styles.css'],

  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  repetir_contrasena = '';
  codigoInvitacion = '';

  mostrarPassword = false;
  mostrarRepetirPassword = false;

  constructor(private http: HttpClient, private router: Router) {}

  registrar() {
    if (this.password !== this.repetir_contrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const datos = {
      username: this.username,
      email: this.email,
      password: this.password,
      repetir_contrasena: this.repetir_contrasena,
      referido_por_codigo: this.codigoInvitacion
    };

    this.http.post('http://localhost:8000/api/usuarios/registro/', datos).subscribe({
      next: () => {
        alert('✅ Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Detalles del error:', error.error);
        alert('❌ Error en el registro: ' + JSON.stringify(error.error));
      }
    });
  }
}
