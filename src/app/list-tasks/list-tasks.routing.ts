import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

export const ListRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardComponent,
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
