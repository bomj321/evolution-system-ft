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
import { GlobalService } from './global.service';

//Content type to request
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
//Token to public APIs
const httpOptionsXToken = new HttpHeaders().set(
  "X-Token",
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqaXJrYSIsImlhdCI6MTU2MzI1MzQyMCwiZXhwIjoyNTQxNDc0MjIwLCJhdWQiOiJwb3J0YWxqc2lyYSIsInN1YiI6InVzZXJqc2lyYXMiLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.b5hHxud28FhCqWSKK3Wu5FDZO4jUDQxV2qRd5wk3OAw"
);

const httpOptionsXTokenMmongo = new HttpHeaders().set(
  "X-Token",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqaXJrYS1wdWJsaWMiLCJuYW1lIjoiQXV0aG9yaXphdGlvbiIsImlhdCI6MTUxNjIzOTAyMn0.pDU-3E-XTKHvtboiUZJ4qE5YLo9w5eZbTOn6-YXjJcI"
);



const basicHeaders = new HttpHeaders()
  .set("Content-type", "application/x-www-form-urlencoded; charset=utf-8")
  .set("Authorization", "Basic " + btoa("my-client:my-secret"));

@Injectable()
export class AuthenticationService {
  private url: string = environment.oauthServer; //This variables is from enviroment.ts
  private server: string = environment.API_URL; //This variables is from enviroment.ts
  private serverMongo: string = environment.API_BASE_MONGO;
  private serverAwsAutheticator: string = environment.API_BASE_AUTHENTICATOR;
  private serverStands: string = environment.API_STANDS;

  private services = {

    login: this.server + "/public/login/",
    aditionalinfo: this.server + "/additionalinfo/pms",
    versionJPMS: this.server + "/public/application/version",
    loginMongo: this.serverAwsAutheticator + "/api/v1",
    revoverPasswordMongo: this.serverAwsAutheticator + "/public/api/v1",
    eventInscription: this.serverStands + "/api/v1/event-inscriptions",
    eventInscriptionPublic: this.serverStands + "/public/api/v1/event-inscriptions",
  };

  public currentUser: any; //Variable to actual user logged
  private context = "feria-virtual"; // Variable to determine what system it is
  private localData = {
    currentUser: "currentUser" + this.context,
    language: "language",
    lang: "lang",
    affiliate: "affiliate" + this.context,
    expire_date: "expire_date" + this.context,
    additionalInfo: "additionalInfo" + this.context,
    access_token: "access_token" + this.context,
    token_type: "token_type" + this.context,
    refresh_token: "refresh_token" + this.context,
    email: "email" + this.context,
    password: "password" + this.context,
    removeItem: "removeItem" + this.context,
    rebember_value: "rebember_value" + this.context,
  };

  @Output() updateUserData = new EventEmitter<any>()
  constructor(private globalService: GlobalService, private http: HttpClient, private router: Router, private generalFunctionsService: GeneralFunctionsService,
  ) { }

  /***********************BASIC FUNCTIONS to LOGIN***************************** */

  public login(username: string, password: string) {
    const data = {
      username: username,
      password: password,
      grant_type: "password",
      scope: "read",
    };

    const headers = new HttpHeaders()
      .set("Content-type", "application/x-www-form-urlencoded; charset=utf-8")
      .set("Authorization", "Basic " + btoa("my-client:my-secret"));
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        Authorization: "Basic " + btoa("my-client:my-secret"),
      }),
    };

    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    params.append("grant_type", "password");
    params.append("scope", "read");

    return this.http
      .post(`${this.url}/oauth/token`, params.toString(), { headers: headers })
      .map((resp) => {
        this.saveToken(resp);
        return resp;
      });
  }


  public loginMongo(data) {

    return this.http.post(this.services.loginMongo + '/signin', data, httpOptions);
  }


  public registerMongo(data) {
    return this.http.post(this.services.loginMongo + '/register/user', data, httpOptions);
  }

  /***********************BASIC FUNCTIONS to LOGIN***************************** */


  /*********************************************FAMOUS SERVICE ME, TO GET MORE INFORMATION FRON AFFILIATE********************************* */

  me() {
    const header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${localStorage.getItem(this.localData.access_token)}`
      ),
    };
    return this.http.get(`${this.server}/me`, header).map((resp) => {
      return resp;
    });
  }

  /*********************************************FAMOUS SERVICE ME, TO GET MORE INFORMATION FRON AFFILIATE********************************* */

  /************************************************FUNCTIONS TO LOCAL STORAGE******************************* */

  setCurrentUser(user) {
    this.currentUser = user;

    localStorage.setItem(this.localData.access_token, user.bearerToken);
    //localStorage.setItem( this.localData.access_token, btoa(user.bearerToken);


    localStorage.setItem(
      this.localData.currentUser,
      btoa(unescape(encodeURIComponent(JSON.stringify(user))))
    );


    this.updateUserData.emit(user)
    localStorage.setItem(this.localData.language, "es");
  }

  getCurrentUser() {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem(this.localData.currentUser)))))
    } catch (error) { }
  }

  getCurrentUserInfo() {
    try {
      let user = this.getCurrentUser()
      return user.userInfo
    } catch (error) {
      return null
    }
  }

  getCurrentUserId() {
    try {
      let user = JSON.parse(atob(localStorage.getItem(this.localData.currentUser)))
      return user.userInfo.userId
    } catch (error) {
      return null
    }
  }

  saveToken(token) {
    // This token is important to APIs with authentication
    localStorage.setItem(this.localData.access_token, token);
  }

  setAffiliate(affiliate: any) {
    localStorage.setItem(
      this.localData.affiliate,
      btoa(JSON.stringify(affiliate))
    );
  }

  setAdditionalInfo(affiliate: any) {
    localStorage.setItem(
      this.localData.additionalInfo,
      btoa(JSON.stringify(affiliate))
    );
  }

  getAffiliate() {
    try {
      return JSON.parse(atob(localStorage.getItem(this.localData.affiliate)));
    } catch (error) {
      return null;
    }
  }

  getRefreshToken() {
    return localStorage.getItem(this.localData.refresh_token);
  }

  getToken() {
    return localStorage.getItem(this.localData.access_token);
  }

  getTokenType() {
    return localStorage.getItem(this.localData.token_type);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.localData.access_token) != null
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

  getCurrentPermissions() {
    try {
      return (
        JSON.parse(atob(localStorage.getItem(this.localData.currentUser)))
          .permissions || []
      );
    } catch (error) {
      this.logOut();
    }
  }

  logoutApi(data) {

    const header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${localStorage.getItem(this.localData.access_token)}`
      ),
    };


    return this.http.put(this.services.loginMongo + '/signout', data, header);
  }

  /****************FUNCTIONS TO LOCAL STORAGE******************************* */

  logOut(slug = null, message = false, messageText = '') {
    localStorage.removeItem(this.localData.access_token);
    localStorage.removeItem(this.localData.expire_date);
    localStorage.removeItem(this.localData.token_type);
    localStorage.removeItem(this.localData.lang);
    localStorage.removeItem(this.localData.refresh_token);
    localStorage.removeItem(this.localData.currentUser);
    localStorage.removeItem(this.localData.additionalInfo);
    localStorage.removeItem('buttonBackStand');


    if (slug) {
      this.router.navigate([slug + '/lobby']);

    } else {
      this.router.navigate(["/"]);
    }

  }

  logOutWIthOutRemove(slug = null, message = false, messageText = '') {


    if (slug) {
      this.router.navigate([slug + '/lobby']);
    } else {
      this.router.navigate(["/"]);

    }


  }


  logOutWithOutRedirect() {
    localStorage.removeItem(this.localData.access_token);
    localStorage.removeItem(this.localData.expire_date);
    localStorage.removeItem(this.localData.token_type);
    localStorage.removeItem(this.localData.lang);
    localStorage.removeItem(this.localData.refresh_token);
    localStorage.removeItem(this.localData.currentUser);
    localStorage.removeItem(this.localData.additionalInfo);
    localStorage.removeItem('buttonBackStand');

  }

  /********************************************OTHER FUNCTIONS ***************************************************** */

  resetPassword(data) {
    return this.http.post(this.services.revoverPasswordMongo + "/recover-password", data, {
      headers: httpOptionsXTokenMmongo,
    });
  }

  changePassword(data, userId) {
    return this.http.post(
      this.server + "/users/changepassword/" + userId,
      data
    );
  }

  /************************GETS EMPRESS AND COUNTRIES */

  getCompaniesExistMongo(params: HttpParams) {
    return this.http.get(this.services.revoverPasswordMongo + "/companies" + "?" + params.toString(), { headers: httpOptionsXTokenMmongo });
  }

  getAcademicExistMongo(params: HttpParams) {
    return this.http.get(this.services.revoverPasswordMongo + "/academic-institutions" + "?" + params.toString(), { headers: httpOptionsXTokenMmongo });
  }

  getCountriesExistMongo(params: HttpParams) {
    return this.http.get(this.services.revoverPasswordMongo + "/countries" + "?" + params.toString(), { headers: httpOptionsXTokenMmongo });
  }


  getDepartmentsExistMongo(params: HttpParams) {
    return this.http.get(this.services.revoverPasswordMongo + "/departments" + "?" + params.toString(), { headers: httpOptionsXTokenMmongo });
  }

  getMunicipalitiesExistMongo(params: HttpParams) {
    return this.http.get(this.services.revoverPasswordMongo + "/municipalities" + "?" + params.toString(), { headers: httpOptionsXTokenMmongo });
  }


  /************************GETS EMPRESS AND COUNTRIES */


  createCompany(data) {
    return this.http.post(this.services.revoverPasswordMongo + '/companies', data, { headers: httpOptionsXTokenMmongo });
  }

  getUserExistMongo(params: HttpParams) {
    return this.http.get(this.services.revoverPasswordMongo + "/users" + "?" + params.toString(), { headers: httpOptionsXTokenMmongo });
  }

  getChargesExistMongo(params: HttpParams) {
    return this.http.get(this.services.revoverPasswordMongo + "/charges" + "?" + params.toString(), { headers: httpOptionsXTokenMmongo });
  }

  editUser(data, username) {
    return this.http.put(this.services.revoverPasswordMongo + '/users/by-username/' + username, data, { headers: httpOptionsXTokenMmongo });
  }

   registerEventInscription(data) {
    return this.http.post(this.services.eventInscription, data, httpOptions);
  }

  getEventInscription(commercialUuidKey, eventId, userId) {
    return this.http.get(this.services.eventInscriptionPublic + "/by-user/" + commercialUuidKey + "/" + eventId + "/" + userId, { headers: httpOptionsXTokenMmongo });
  }

  getUserExist(params: HttpParams) {
    //return this.http.get(this.url);
    return this.http.get(
      this.server + "/public/users" + "?" + params.toString(),
      httpOptions
    );
  }

}
