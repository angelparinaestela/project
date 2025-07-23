// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['../auth-page/shared-auth.styles.css'],

  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    const datos = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>('http://localhost:8000/api/usuarios/login/', datos).subscribe({
      next: (respuesta) => {
        this.auth.guardarToken(respuesta.access);
        console.log('✅ Token guardado:', respuesta.access);
        this.router.navigate(['/panel']);
      },
      error: () => {
        alert('❌ Usuario o contraseña incorrectos');
      }
    });
  }
}
