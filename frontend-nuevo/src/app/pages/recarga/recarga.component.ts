import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecargaService } from '../../servicios/recarga.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-recarga',
  standalone: true,
  templateUrl: './recarga.component.html',
  styleUrls: ['./recarga.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class RecargaComponent implements OnInit {
  qrUrl: string = '';
  qrNombre: string = ''; 
  voucherFile: any;
  mensaje: string = '';
  recargas: any[] = [];

  niveles: any[] = [];
  vipActual: number = 0;
  nivelSeleccionado: number | null = null;
  cargando: boolean = false;

  constructor(private recargaService: RecargaService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarQR();
    this.listarRecargas();
    this.obtenerNiveles();
  }

  cargarQR() {
    this.recargaService.obtenerQrActivo().subscribe((res: any) => {
      this.qrUrl = res.url;
      this.qrNombre = res.nombre;
    });
  }

  obtenerNiveles(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any>('http://localhost:8000/api/usuarios/niveles-vip/', { headers }).subscribe({
      next: (resp) => {
        this.niveles = resp;
        this.vipActual = 0; 
      },
      error: () => alert('Error al cargar niveles VIP')
    });
  }

  seleccionarNivel(nivel: number): void {
    this.nivelSeleccionado = nivel;
  }

  onFileChange(event: any) {
    this.voucherFile = event.target.files[0];
  }

  subirVoucher() {
    if (!this.voucherFile || !this.nivelSeleccionado) {
      this.mensaje = 'Selecciona un nivel y una imagen';
      return;
    }

    const formData = new FormData();
    formData.append('imagen_voucher', this.voucherFile);
    formData.append('monto', this.niveles.find(n => n.nivel === this.nivelSeleccionado).monto);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.cargando = true;
    this.http.post('http://localhost:8000/api/usuarios/recargar/', formData, { headers }).subscribe({
      next: () => {
        this.mensaje = 'Comprobante enviado. Esperando validación.';
        this.listarRecargas();
        this.obtenerNiveles();
      },
      error: () => {
        this.mensaje = 'Error al enviar comprobante';
      },
      complete: () => this.cargando = false
    });
  }

  listarRecargas() {
    this.recargaService.listarRecargas().subscribe((res: any) => {
      this.recargas = res;
    });
  }
}
