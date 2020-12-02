import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

export const AppRoutes: Routes = [

  {
    path: 'dashboard',
    component: FullComponent,
    loadChildren: () => import('./dashboards/dashboard.module').then(m => m.DashboardModule)
  },

  {
    path: 'lists-tasks',
    component: FullComponent,
    loadChildren: () => import('./list-tasks/list-tasks.module').then(m => m.ListTasksModule)
  },

  {
    path: "",
    component: BlankComponent,
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },

  {
    path: '**',
    redirectTo: '/'
  }

];
