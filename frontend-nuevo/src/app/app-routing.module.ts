import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PanelComponent } from './usuario/panel/panel.component';
import { TareasComponent } from './usuario/tareas/tareas.component';
import { AdminComponent } from './admin/admin/admin.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { TareasAdminComponent } from './admin/tareas-admin/tareas-admin.component';
import { AuthGuard } from './auth-guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'panel', component: PanelComponent, canActivate: [AuthGuard] },
  { path: 'tareas', component: TareasComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  {
    path: 'recarga',
    loadComponent: () =>
      import('./pages/recarga/recarga.component').then(m => m.RecargaComponent),
    canActivate: [AuthGuard]
  },
  { path: 'admin/usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: 'admin/tareas', component: TareasAdminComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
