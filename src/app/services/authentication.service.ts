import { Injectable, Output, EventEmitter } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";

// import { Observable } from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

// import { Observable } from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

// import { Observable, Subject } from 'rxjs';

import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { GeneralFunctionsService } from './general-functions.service';

//Content type to request
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};


@Injectable()
export class AuthenticationService {

  private server: string = environment.API_URL;
  private services = {
    login: this.server + "/login",
    register: this.server + "/register"
  };

  private context = "evolution"; // Variable to determine what system it is
  private localData = {
    currentUser: 'currentUser' + this.context,
    access_token: "access_token" + this.context,
    email: "email" + this.context,
    password: "password" + this.context,
    rebember_value: "rebember_value" + this.context,
  };

  @Output() updateUserData = new EventEmitter<any>()
  constructor(private http: HttpClient, private router: Router, private generalFunctionsService: GeneralFunctionsService,
  ) { }

  /***********************BASIC FUNCTIONS to LOGIN***************************** */

  public login(data) {
    return this.http.post(this.services.login, data, httpOptions);
  }

  public register(data) {
    return this.http.post(this.services.register, data, httpOptions);
  }

  /***********************ASIC FUNCTIONS to LOGIN***************************** */



  /************************************************FUNCTIONS TO LOCAL STORAGE******************************* */

  saveToken(token) {
    localStorage.setItem(this.localData.access_token, token);
  }

  setCurrentUser(user) {
    localStorage.setItem(this.localData.currentUser, btoa(JSON.stringify(user)));
  }

  getCurrentUser() {
    try {
      return JSON.parse(atob(localStorage.getItem(this.localData.currentUser) || '{}'))
    } catch (error) {
      return '{}';
    }
  }

  getToken() {
    return localStorage.getItem(this.localData.access_token);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.localData.access_token) != null
      ? true
      : false;
  }


  isCurrentUser(): boolean {
    return localStorage.getItem(this.localData.currentUser) != null
      ? true
      : false;
  }

  getRememberEmail() {
    return localStorage.getItem(this.localData.email);
  }

  getRememberPassword() {
    return localStorage.getItem(this.localData.password);
  }

  getRemember(): boolean {
    return localStorage.getItem(this.localData.rebember_value) === "true"
      ? true
      : false;
  }

  setRemember(username: string, password: string, remember: boolean) {
    if (remember) {
      localStorage.setItem(this.localData.rebember_value, "true");
      localStorage.setItem(this.localData.email, username);
      localStorage.setItem(this.localData.password, password);
    } else {
      localStorage.removeItem(this.localData.rebember_value);
      localStorage.removeItem(this.localData.email);
      localStorage.removeItem(this.localData.password);
    }
  }



  /****************FUNCTIONS TO LOCAL STORAGE******************************* */

  logOut() {
    localStorage.removeItem(this.localData.access_token);
    localStorage.removeItem(this.localData.currentUser);    
    this.router.navigate(["/"]);
  }





}
