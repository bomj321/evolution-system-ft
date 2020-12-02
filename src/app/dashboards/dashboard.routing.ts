import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UrlAuthGuard } from "../_guards/url-auth.guard";

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [UrlAuthGuard],
        data: {
          title: 'Tablero principal',
          urls: [
            { title: 'Tablero principal', url: '/dashboard' }
          ]
        }
      }

    ]
  }
];
