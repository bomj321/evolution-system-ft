import { Component } from '@angular/core';

import { GeneralFunctionsService } from '../../services/general-functions.service'

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {


  /****variables From form */
  public fullName: String;
  public email: any;
  public password: any;
  public passwordConfirm: any;

  constructor(public generalFunctionsService: GeneralFunctionsService) { }

  public saveUser() {

    $("#fullName").removeClass("is-invalid");
    $("#email").removeClass("is-invalid");
    $("#password").removeClass("is-invalid");
    $("#passwordConfirm").removeClass("is-invalid");

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
      this.generalFunctionsService.notifications('Debe ingresar un correo válido', 'danger');
      let element = document.getElementById("email");
      $("#email").addClass("status-danger");
      element.focus();
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


  }


}
