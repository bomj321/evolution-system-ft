import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UrlAuthGuard } from "../_guards/url-auth.guard";

export const ListRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [UrlAuthGuard],
        data: {
          title: 'Listado de tareas',
          urls: [
            { title: 'Listado de tareas', url: '/lists-tasks' },
          ]
        }
      }
  
    ]
  }
];
