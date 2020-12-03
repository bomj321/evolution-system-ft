import { Component } from '@angular/core';
import { GeneralFunctionsService } from '../../services/general-functions.service'
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from "@angular/router";

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  providers: [
    AuthenticationService
  ]
})
export class SignupComponent {


  /****variables From form */
  public fullName: String;
  public email: any;
  public password: any;
  public passwordConfirm: any;
  public termConditions: boolean = false;
  public loading: boolean = false;

  constructor(private router: Router, public generalFunctionsService: GeneralFunctionsService, private authenticationService: AuthenticationService) { }

  public saveUser() {

    $("#fullName").removeClass("is-invalid");
    $("#email").removeClass("is-invalid");
    $("#password").removeClass("is-invalid");
    $("#passwordConfirm").removeClass("is-invalid");
    $("#termConditions").removeClass("is-invalid");


    if (this.fullName == null || this.fullName == '') {
      this.generalFunctionsService.notifications('Debe ingresar un nombre', 'error');
      let element = document.getElementById("fullName");
      $("#fullName").addClass("is-invalid");
      if (element) { element.focus(); }
      return;
    }


    if (this.email == null || this.email == '') {
      this.generalFunctionsService.notifications('Debe ingresar un correo', 'error');
      let element = document.getElementById("email");
      $("#email").addClass("is-invalid");
      if (element) { element.focus(); }
      return;
    }


    if (this.generalFunctionsService.validateEmail(this.email) == false) {
      this.generalFunctionsService.notifications('Debe ingresar un correo válido', 'error');
      let element = document.getElementById("email");
      $("#email").addClass("is-invalid");
      if (element) { element.focus(); }
      return;
    }


    if (this.password == null || this.password == '') {
      this.generalFunctionsService.notifications('Debe ingresar una clave', 'error');
      let element = document.getElementById("password");
      $("#password").addClass("is-invalid");
      if (element) { element.focus(); }
      return;
    }


    if (this.password != this.passwordConfirm) {
      this.generalFunctionsService.notifications('Las contraseñas ingresadas no coinciden', 'error');
      let element = document.getElementById("password");
      $("#password").addClass("is-invalid");
      if (element) { element.focus(); }
      return;
    }
    if (this.termConditions == false) {
      this.generalFunctionsService.notifications('Debes aceptar los terminos y condiciones', 'error');
      let element = document.getElementById("termConditions");
      $("#termConditions").addClass("is-invalid");
      if (element) { element.focus(); }
      return;
    }



    let objectRequest =
    {
      "fullName": this.fullName,
      "email": this.email,
      "password": this.password,

    }

    this.loading = true;
    this.authenticationService.register(objectRequest)
      .subscribe(
        (resp: any) => {

          if (resp.message && resp.message == 'USER_EXIST') {
            this.generalFunctionsService.notifications('Este usuario ya existe, por favor contacta con el administrador', 'warning');
          } else if(resp.message && resp.message == 'DATA_INCOMPLETE') {
            this.generalFunctionsService.notifications('Disculpa pero tienes datos faltantes', 'error');
          }else
          {
            this.generalFunctionsService.notifications('Felicidades tus datos han sido registrados, ahora logueate', 'success');
            this.router.navigate(["/"]);
          }
          this.loading = false;

        },
        error => {
          this.generalFunctionsService.notifications('Ha ocurrido un error al registrarte, por favor contacta con el administrador', 'error');
          this.loading = false;
        }
      );


  }


}
