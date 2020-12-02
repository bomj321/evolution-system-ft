import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutes } from './dashboard.routing';

import { ProjectCounterComponent } from './dashboard-components/project-counter/project-counter.component';
import { FeedsComponent } from './dashboard-components/feeds/feeds.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  declarations: [
    Dashboard1Component,
    ProjectCounterComponent,
    FeedsComponent  ]
})
export class DashboardModule {}
