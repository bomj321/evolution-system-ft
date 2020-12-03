import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthenticationService } from "../../services/authentication.service";
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public config: PerfectScrollbarConfigInterface = {};
  constructor(private authenticationService: AuthenticationService) {}

  public showSearch = false;

  logOut() {
    this.authenticationService.logOut();
  }

  ngAfterViewInit() {}
}
