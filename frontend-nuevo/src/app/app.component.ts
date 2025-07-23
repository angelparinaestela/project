import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Importa RouterModule
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule]  // Importa RouterModule para usar router-outlet
})
export class AppComponent {
  title = 'frontend-nuevo';

  constructor(private authService: AuthService) {}
}
