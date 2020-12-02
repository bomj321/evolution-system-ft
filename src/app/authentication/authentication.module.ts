import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { AuthenticationRoutes } from './authentication.routing';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(AuthenticationRoutes), NgbModule, FormsModule, NgxLoadingModule.forRoot({}) ],
  declarations: [LoginComponent, SignupComponent]
})
export class AuthenticationModule {}
