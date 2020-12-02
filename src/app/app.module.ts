import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';


/*********Components********* */

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { AppComponent } from './app.component';
import { NavigationComponent } from './shared/header-navigation/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { SpinnerComponent } from './shared/spinner.component';


/****Routes ****/
import { AppRoutes } from './app-routing.module';
import { RouterModule } from '@angular/router';


/*******Extensions */
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};


@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    SidebarComponent,
    BreadcrumbComponent,
    SpinnerComponent
  ],
  imports: [
    HttpClientModule,
    ToastrModule.forRoot(),
    CommonModule,
    BrowserModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    PerfectScrollbarModule,
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
