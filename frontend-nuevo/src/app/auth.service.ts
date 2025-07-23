import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  // 🔐 Login
  login(data: { username: string, password: string }) {
    return this.http.post(`${this.apiUrl}usuarios/login/`, data);
  }

  // 📝 Registro
  registro(data: any) {
    return this.http.post(`${this.apiUrl}usuarios/registro/`, data);
  }

  // 👤 Obtener perfil del usuario con token
  obtenerPerfil() {
    const token = this.obtenerToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}usuarios/perfil/`, { headers });
  }

  // 💾 Guardar token
  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  // 📤 Obtener token
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // ❌ Eliminar token y redirigir
  eliminarToken() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // 🔐 Verificar autenticación
  isAuthenticated(): boolean {
    const token = this.obtenerToken();
  console.log("🔐 Token detectado por AuthGuard:", token);
  return !!token;
  }

  obtenerReferidos() {
  const token = this.obtenerToken();
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get(`${this.apiUrl}usuarios/referidos/`, { headers });
}
  // 🔓 Logout
  logout() {
    this.eliminarToken();
  }
}
