import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { GeneralFunctionsService } from '../../services/general-functions.service'
import { TaskService } from "../../services/task.service";

import { format, isEqual } from 'date-fns';
@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    TaskService
  ]
})
export class DashboardComponent implements OnInit {
 
  public currentUser: any;
  public loading: boolean = false;
  public tasks: any;

  constructor(
    private authenticationService: AuthenticationService,
    public generalFunctionsService: GeneralFunctionsService,
    private taskService: TaskService) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.getCurrentUser();
    this.getTasks();
  }

  getTasks() {
    this.loading = true;

    this.taskService.getAllTasks(this.currentUser._id).subscribe((tasks: any) => {
      this.tasks = tasks.topics;
      this.loading = false;
    },
      error => {

        if(error.error.message == 'NOT_TOPICS')
        {
          this.generalFunctionsService.notifications('No tienes tareas registradas', 'error');
          this.tasks = [];

        }else
        {
          this.generalFunctionsService.notifications('Ha ocurrido un error al obtener las tareas, por favor contacte con el administrador', 'error');

        }
        this.loading = false;
      })
  }


}
