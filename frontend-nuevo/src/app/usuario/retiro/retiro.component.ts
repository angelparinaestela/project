import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-retiro',
  standalone: true,
  templateUrl: './retiro.component.html',
  styleUrls: ['./retiro.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RetiroComponent implements OnInit {
  bancos: any[] = [];
  bancoSeleccionado: string = '';
  numeroCuenta: string = '';
  monto: number = 0;

  saldo: number = 0;
  montoMinimoRetiro: number = 50;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarBancos();
    this.obtenerSaldo();
  }

  cargarBancos() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:8000/api/usuarios/bancos/', { headers }).subscribe({
      next: (data) => {
        this.bancos = data;
      },
      error: (error) => {
        console.error('Error al cargar bancos:', error);
        alert('Error al cargar la lista de bancos');
      }
    });
  }

  obtenerSaldo() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:8000/api/usuarios/perfil/', { headers }).subscribe({
      next: (data) => {
        this.saldo = data.saldo;
      },
      error: (error) => {
        console.error('Error al obtener saldo:', error);
      }
    });
  }

  enviarSolicitud() {
    if (this.monto < this.montoMinimoRetiro) {
      alert(`❌ El monto mínimo de retiro es S/${this.montoMinimoRetiro}`);
      return;
    }

    if (this.saldo < this.montoMinimoRetiro) {
      alert(`❌ Tu saldo actual (S/${this.saldo}) no alcanza el mínimo para retirar`);
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const datos = {
      banco: this.bancoSeleccionado,
      numero_cuenta: this.numeroCuenta,
      monto: this.monto
    };

    this.http.post('http://localhost:8000/api/usuarios/retiros/', datos, { headers }).subscribe({
      next: () => {
        alert('✅ Solicitud enviada con éxito');
        this.router.navigate(['/panel']);
      },
      error: (error) => {
        console.error('Error al enviar solicitud:', error);
        alert('❌ Error al enviar la solicitud');
      }
    });
  }
}
