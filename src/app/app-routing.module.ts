import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

export const AppRoutes: Routes = [

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
