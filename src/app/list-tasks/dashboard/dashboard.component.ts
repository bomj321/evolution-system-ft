import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { GeneralFunctionsService } from '../../services/general-functions.service'
import { TaskService } from "../../services/task.service";
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


/******MODALS*** */
import { TasksModalComponent } from '../..//modals/tasks-modal/tasks-modal.component';


declare var require: any;

const data: any = require('./data.json');

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    TaskService,
    AuthenticationService
  ]
})
export class DashboardComponent implements OnInit {



  public searchParams: any;
  public loading: boolean = false;
  public pageSize: number = 10;
  public page: number = 1;
  public currentUser: any;
  public tasks: any;

  constructor(
    private authenticationService: AuthenticationService,
    public generalFunctionsService: GeneralFunctionsService,
    private modal: NgbModal,
    private taskService: TaskService) { }

  ngOnInit() {

    this.currentUser = this.authenticationService.getCurrentUser();
    this.getTasks();
  }

  /********************CRUD****************************** */

  openModalTask(task = null) {
    const modal = this.modal.open(TasksModalComponent);
    modal.componentInstance.taskInformation = task;
    modal.componentInstance.onSaveTask.subscribe(($e) => {
      this.getTasks(1);
    })
  }

  getTasks(page = 1, searchParams = false) {
    this.loading = true;
    this.page = page

    this.taskService.getTasks(this.currentUser._id, page, searchParams).subscribe((tasks: any) => {
      this.tasks = tasks;
      this.loading = false;
    },
      error => {
        this.loading = false;
        this.generalFunctionsService.notifications('Ha ocurrido un error al obtener las tareas, por favor contacte con el administrador', 'error');
      })
  }


  deleteTasksFunction(id) {
    this.loading = true;
    this.taskService.deleteTask(id).subscribe(
      data => {
        this.loading = false;
        this.generalFunctionsService.notifications('Tarea eliminada con éxito', 'success');
        this.getTasks(this.page);
      },
      error => {
        this.loading = false;
        this.generalFunctionsService.notifications('Ha ocurrido un error al eliminar la tarea, por favor contacte con el administrador', 'error');

      }
    );
  }

  deleteTask(id) {
    swal({
      title: 'Estás seguro?',
      text: "¿Estás seguro de eliminar?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.deleteTasksFunction(id);

      } else if (
        result.dismiss === swal.DismissReason.cancel
      ) {
      }
    })
  }

}
