import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin/admin.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { TareasAdminComponent } from './admin/tareas-admin/tareas-admin.component';
import { AuthGuard } from './auth-guard';
import { LayoutPrincipalComponent } from './componentes/layout-principal/layout-principal.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },

  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth-page/auth-page.component').then(m => m.AuthPageComponent)
  },

  {
    path: '',
    component: LayoutPrincipalComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'panel',
        loadComponent: () =>
          import('./usuario/panel/panel.component').then(m => m.PanelComponent)
      },
      {
        path: 'tareas',
        loadComponent: () =>
          import('./usuario/tareas/tareas.component').then(m => m.TareasComponent)
      },
      {
        path: 'retiro',
        loadComponent: () =>
          import('./usuario/retiro/retiro.component').then(m => m.RetiroComponent)
      },
      {
        path: 'recarga',
        loadComponent: () =>
          import('./pages/recarga/recarga.component').then(m => m.RecargaComponent)
      },
      {
        path: 'referidos',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./usuario/referidos/referidos.component').then(m => m.ReferidosComponent)
      },
      {
        path: 'historial-retiros',
        loadComponent: () =>
          import('./historial-retiros/historial-retiros.component').then(m => m.HistorialRetirosComponent)
      }
    ]
  },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'tareasAdmin', component: TareasAdminComponent }
    ]
  },

  { path: '**', redirectTo: 'auth' }
];
