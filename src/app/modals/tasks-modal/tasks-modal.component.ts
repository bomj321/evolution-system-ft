import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { GeneralFunctionsService } from '@app/services/general-functions.service'
import { TaskService } from "../../services/task.service";

declare var jQuery: any;
declare var $: any;

const I18N_VALUES = {
  'es': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'es';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct {
    let result: any = null;
    if (value) {
      let date = value.split(this.DELIMITER);
      result = {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return result;
  }

  format(date: NgbDateStruct): string {
    let result: any = null;
    if (date) {
      result = date.day + this.DELIMITER + date.month + this.DELIMITER + date.year;
    }
    return result;
  }
}

@Component({
  selector: 'app-tasks-modal',
  templateUrl: './tasks-modal.component.html',
  styleUrls: ['./tasks-modal.component.scss'],
  providers: [
    TaskService
  ]
})
export class TasksModalComponent implements OnInit {

  @Output() onSaveTask = new EventEmitter();
  @Input() taskInformation = null;
  public titleModal: any = 'Gestionar tareas';
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate;
  public toDate: NgbDate | null = null;



  public dateDatePickerYear;
  public dateDatePickerMonth;
  public dateDatePickerDate;

  /*******variables to task**** */
  public title: any;
  public exp: any;
  public priority: any = 'N';
  public content: any;
  public objectRequest: any;
  public loading: boolean;


  constructor(
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private generalFunctionsService: GeneralFunctionsService,
    private taskService: TaskService
  ) { }



  ngOnInit() {
    this.setMinDateDatePicker();
    if (this.taskInformation) {
      this.editTask(this.taskInformation);
    }

  }

  setMinDateDatePicker() {
    let dateDatePicker = new Date();
    this.dateDatePickerYear = dateDatePicker.getFullYear();
    this.dateDatePickerMonth = dateDatePicker.getMonth() + 1;
    this.dateDatePickerDate = dateDatePicker.getDate() + 1;
  }



  close() {
    this.activeModal.dismiss('close');
  }

  /**NG DATEPICKER */


  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  /********************CRUD SERVICES******************* */

  saveTask() {


    $("#title").removeClass("is-invalid");
    $("#exp").removeClass("is-invalid");
    $("#priority").removeClass("is-invalid");
    $("#content").removeClass("is-invalid");


    if (this.title == null || this.title == '') {
      this.generalFunctionsService.notifications('Debe ingresar un nombre', 'error');
      let element = document.getElementById("title");
      $("#title").addClass("is-invalid");
      if (element) {
        element.focus();
      }
      return;
    }


    if (this.exp == null || this.exp == '') {
      this.generalFunctionsService.notifications('Debe ingresar una fecha de vencimiento', 'error');
      let element = document.getElementById("exp");
      $("#exp").addClass("is-invalid");
      if (element) {
        element.focus();
      }
      return;
    }


    if (this.priority == null || this.priority == '') {
      this.generalFunctionsService.notifications('Debe ingresar un nombre', 'error');
      let element = document.getElementById("priority");
      $("#priority").addClass("is-invalid");
      if (element) {
        element.focus();
      }
      return;
    }


    if (this.content == null || this.content == '') {
      this.generalFunctionsService.notifications('Debe ingresar un contenido', 'error');
      let element = document.getElementById("content");
      $("#content").addClass("is-invalid");
      if (element) {
        element.focus();

      }
      return;
    }

    this.loading = true;
    this.eventToSaveEdit();

  }



  eventToSaveEdit() {
    this.objectRequest =
    {
      "title": this.title.toString(),
      "content": this.content,
      "priority": this.priority,
      "exp": `${this.exp.year}-${this.generalFunctionsService.addZero((this.exp.month))}-${this.generalFunctionsService.addZero((this.exp.day))}`
    };

    if (this.taskInformation) {
      this.editContentService(this.objectRequest, this.taskInformation);
    } else {
      this.saveContentService(this.objectRequest);
    }
  }


  saveContentService(objectRequest) {
    this.taskService.saveTask(objectRequest).subscribe(
      data => {
        if (data && data['message'] == 'DATA_INCOMPLETE') {
          this.generalFunctionsService.notifications('Disculpa pero tienes datos faltantes', 'error');
        } else if (data && data['message'] == 'NOT_VALID_VALIDATION') {
          this.generalFunctionsService.notifications('Disculpa pero tienes datos faltantes', 'error');
        } else {
          this.generalFunctionsService.notifications('Tarea añadida con éxito', 'success');
          this.close();
          this.onSaveTask.emit('SAVED');
        }
        this.loading = false;
      },
      error => {
        this.generalFunctionsService.notifications('Ha ocurrido un error al guardar la tarea, por favor contacte con el administrador', 'error');
        this.loading = false;

      }
    );
  }

  editContentService(objectRequest, taskInformation) {
    this.taskService.updateTask(objectRequest, taskInformation._id).subscribe(data => {

      if (data && data['message'] == 'DATA_INCOMPLETE') {
        this.generalFunctionsService.notifications('Disculpa pero tienes datos faltantes', 'error');
      } else if (data && data['message'] == 'NOT_VALID_VALIDATION') {
        this.generalFunctionsService.notifications('Disculpa pero tienes datos faltantes', 'error');
      } else {
        this.generalFunctionsService.notifications('Tarea editada con éxito', 'success');
        this.close();
        this.onSaveTask.emit('UPDATED');
      }
      this.loading = false;
    }, error => {
      this.generalFunctionsService.notifications('Ha ocurrido un error al editar la tarea, por favor contacte con el administrador', 'error');
      this.loading = false;

    })

  }





  deleteFields() {
    this.objectRequest = null;
    this.taskInformation = null;
    this.title = null;
    this.exp = null;
    this.priority = null;
    this.content = null;
  }



  /******************PERCENTAGE***************** */

  editTask(taskContent) {

    this.title = taskContent.title;
    this.priority = taskContent.priority;
    this.content = taskContent.content;
    var formatStartDate = new Date(taskContent.exp + 'T00:00');
    this.exp =
    {
      "year": formatStartDate.getFullYear(),
      "month": (formatStartDate.getMonth() + 1),
      "day": parseInt(this.generalFunctionsService.addZero(formatStartDate.getDate()))
    };

  }

}
