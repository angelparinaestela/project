import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css'],
  imports: [CommonModule, LoginComponent, RegisterComponent],
})
export class AuthPageComponent {
  selectedForm: 'login' | 'register' = 'login';

  seleccionar(form: 'login' | 'register') {
    this.selectedForm = form;
  }
}
