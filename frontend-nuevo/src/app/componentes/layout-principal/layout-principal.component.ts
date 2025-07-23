import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';  // Importa lo que se usará en la plantilla
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-principal',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout-principal.component.html',
  styleUrls: ['./layout-principal.component.css']
})
export class LayoutPrincipalComponent {}
