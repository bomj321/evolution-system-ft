import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from "./authentication.service";

const headers = new HttpHeaders().set(
  "X-Token",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqaXJrYS1wdWJsaWMiLCJuYW1lIjoiQXV0aG9yaXphdGlvbiIsImlhdCI6MTUxNjIzOTAyMn0.pDU-3E-XTKHvtboiUZJ4qE5YLo9w5eZbTOn6-YXjJcI"
);

@Injectable({
  providedIn: 'root',
})
export class TaskService {


  private server: string = environment.API_URL;


  private services = {
    task: this.server + "/task",
    tasks: this.server + "/tasks"
  };



  constructor(
    private http: HttpClient,
    public authenticationService: AuthenticationService
  ) { }




  /*********************TASKS****************************** */

  saveTask(data) {
    return this.http.post(this.services.task, data);
  }

  getTasks(idUser, page, searchParams) {

    if (searchParams) {
      return this.http.get(this.services.task + '/' + idUser + '/' + page + '/' + searchParams);
    } else {
      return this.http.get(this.services.task + '/' + idUser + '/' + page);
    }
  }


  getAllTasks(idUser) {
    return this.http.get(this.services.tasks + '/' + idUser);
  }

  getTask(id) {
    return this.http.get(this.services.task + '/' + id);
  }

  deleteTask(id) {
    return this.http.delete(this.services.task + '/' + id);
  }

  updateTask(data, id) {
    return this.http.put(this.services.task + '/' + id, data);
  }

}
