import { Component } from '@angular/core';
import { GeneralFunctionsService } from '../../services/general-functions.service'
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from "@angular/router";

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [
    AuthenticationService
  ]
})
export class LoginComponent {

  public email: String;
  public password: any;
  public loading: boolean = false;

  constructor(private router: Router, public generalFunctionsService: GeneralFunctionsService, private authenticationService: AuthenticationService) {}


  public login() {

    $("#email").removeClass("is-invalid");
    $("#password").removeClass("is-invalid");    

    if (this.email == null || this.email == '') {
      this.generalFunctionsService.notifications('Debe ingresar un correo', 'error');
      let element = document.getElementById("email");
      $("#email").addClass("is-invalid");
      if (element) { element.focus(); }
      return;
    }


    if (this.password == null || this.password == '') {
      this.generalFunctionsService.notifications('Debe ingresar un contraseña', 'error');
      let element = document.getElementById("password");
      $("#password").addClass("is-invalid");
      if (element) { element.focus(); }
      return;
    }

    


    let objectRequest =
    {
      "email": this.email,
      "password": this.password,

    }

    this.loading = true;
    this.authenticationService.login(objectRequest)
      .subscribe(
        (resp: any) => {

          if (resp.message && resp.message == 'NOT_VALID_VALIDATION') {
            this.generalFunctionsService.notifications('Disculpe pero sus datos no son válidos', 'warning');
          } else if(resp.message && resp.message == 'DATA_INCOMPLETE') {
            this.generalFunctionsService.notifications('Disculpa pero tienes datos faltantes', 'error');
          }else
          {
            this.generalFunctionsService.notifications('Felicidades, disfruta del DEMO de tareas', 'success');
            this.authenticationService.saveToken(resp.token);
            this.authenticationService.setCurrentUser(resp.user);
            this.router.navigate(['/dashboard']);

          }
          this.loading = false;
        },
        error => {

          if(error.error.message == 'USER_NOT_EXIST')
          {
            this.generalFunctionsService.notifications('Tus credenciales son incorrectas', 'error');
          }else if(error.error.message == 'CREDENTIALS_NOT_CORRECT')
          {
            this.generalFunctionsService.notifications('Tus credenciales son incorrectas', 'error');
          }else
          {
            this.generalFunctionsService.notifications('Ha ocurrido un error al registrarte, por favor contacta con el administrador', 'error');
          }

          this.loading = false;
        }
      );


  }

  
}
