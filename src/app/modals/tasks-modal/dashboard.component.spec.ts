import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TasksModalComponent } from './tasks-modal.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthenticationService } from "../../services/authentication.service";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


describe('TasksModalComponent', () => {
  let component: TasksModalComponent;
  let fixture: ComponentFixture<TasksModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TasksModalComponent],
      providers:
      [       
        AuthenticationService    ,
        NgbActiveModal
      ],
      imports: [HttpClientTestingModule,
        NgbModule.forRoot(),
        RouterTestingModule,
        ToastrModule.forRoot({
          positionClass: 'toast-top-right'
        })
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
