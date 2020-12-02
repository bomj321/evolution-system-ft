import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { GeneralFunctionsService } from '../../services/general-functions.service'
import { TaskService } from "../../services/task.service";
import swal from 'sweetalert2';


declare var require: any;

const data: any = require('./data.json');

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    TaskService
  ]
})
export class DashboardComponent implements OnInit {



  public searchParams: any;
  public loading: boolean = false;
  public pageSize: number = 10;
  public page: number = 1;
  public currentUser:any;
  public tasks:any;

  constructor(
    private authenticationService: AuthenticationService,
    public generalFunctionsService: GeneralFunctionsService,
    private taskService: TaskService) { }

  ngOnInit() {

    this.currentUser = this.authenticationService.getCurrentUser();
    this.getTasks();
  }

/********************CRUD****************************** */

  getTasks(page = 1, searchParams = false) {
    this.loading = true;
    this.page = page  

    this.taskService.getTasks(this.currentUser._id,page, searchParams).subscribe((tasks: any) => {
      this.tasks = tasks;
      this.loading = false;
    },
      error => {
        this.loading = false;
        this.generalFunctionsService.notifications('Ha ocurrido un error al obtener las tareas, por favor contacte con el administrador', 'error');
      })
  }


  deletePromoFunction(id) {
    
    this.taskService.deleteTask(id).subscribe(
      data => {
        this.getTasks(this.page);
        this.generalFunctionsService.notifications('Promoción eliminada con éxito', 'success');
      },
      error => {

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

        this.deletePromoFunction(id);

      } else if (
        result.dismiss === swal.DismissReason.cancel
      ) {
      }
    })
  }

}
