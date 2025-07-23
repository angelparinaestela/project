import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-2">🗂️ Gestión de Tareas</h2>
      <p class="mb-4">Lista de todas las tareas enviadas por los afiliados.</p>

      <table class="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-200 text-left">
            <th class="px-4 py-2 border">ID</th>
            <th class="px-4 py-2 border">Descripción</th>
            <th class="px-4 py-2 border">Usuario</th>
            <th class="px-4 py-2 border">Estado</th>
            <th class="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let tarea of tareas">
            <td class="px-4 py-2 border">{{ tarea.id }}</td>
            <td class="px-4 py-2 border">{{ tarea.descripcion }}</td>
            <td class="px-4 py-2 border">{{ tarea.usuario }}</td>
            <td class="px-4 py-2 border">{{ tarea.estado }}</td>
            <td class="px-4 py-2 border">
              <button 
                class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mr-2"
                (click)="cambiarEstado(tarea, 'Aprobada')">
                ✅ Aprobar
              </button>
              <button 
                class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                (click)="cambiarEstado(tarea, 'Rechazada')">
                ❌ Rechazar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class TareasComponent {
  tareas = [
    { id: 1, descripcion: 'Subió video de promoción', usuario: 'usuario1', estado: 'Pendiente' },
    { id: 2, descripcion: 'Compartió enlace en redes', usuario: 'usuario2', estado: 'Pendiente' },
    { id: 3, descripcion: 'Realizó venta referida', usuario: 'usuario3', estado: 'Pendiente' }
  ];

  cambiarEstado(tarea: any, nuevoEstado: string) {
    tarea.estado = nuevoEstado;
    alert(`Tarea ${tarea.id} ${nuevoEstado.toLowerCase()}.`);
  }
}
