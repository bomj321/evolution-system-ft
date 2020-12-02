import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class GeneralFunctionsService {

  constructor(private toastr: ToastrService) { }

  /****toastr notifications */

  notifications(message, type) {
      switch (type) {
        case 'success':
          this.toastr.success(message, 'Proceso exitoso.!');
          break;

        case 'error':

          this.toastr.error(message, 'Disculpe');
          break;

        case 'warning':

          this.toastr.warning(message, 'Un momento!');
          break;

        default:
          break;
      }  
    
  }

  validateEmail(valor) {
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)) {
      return true;
    } else {
      return false;

    }
  }

  parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };


  /****Add zero in date */


  public addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  /****Verify if is number */

  isNumber(number) {

    if (isNaN(number)) {
      return false
    } else {
      if (number % 1 == 0) {
        return true;
      } else {
        return true;
      }
    }
  }



  verifyIfNullOrEmpty(param) {
    if (param == null || param == '' || param == 'undefined' || param == false) {
      return true
    } else {
      return false;
    }

  }
  

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }





}
