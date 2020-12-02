import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from "rxjs";
import { throwError } from 'rxjs';
//import { StorageService } from '../services/storage.service';
import { AuthenticationService } from '../services/authentication.service'
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  public modalOption: NgbModalOptions = {}; // not null!


  constructor(private authenticationService: AuthenticationService, private router: Router, private modal: NgbModal, private toastr: ToastrService,
  ) {

  }
  handleError(error: any) {

    console.log(error);

    if (error.status == 401 || error.status == 403) {
      this.authenticationService.logOut()
      this.modal.dismissAll() //cerrar todos los modales  
    }   
    return throwError(error);

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authenticationService.isAuthenticated()) {
      req = req.clone(
        {
          setHeaders:
          {
            'Authorization': `${this.authenticationService.getToken()}`
          }
        });
    //  console.log(req.headers)
      return next.handle(req).catch(error => {
        return this.handleError(error);
      });
    }
    else {
   
    }
    return next.handle(req);
  }
}