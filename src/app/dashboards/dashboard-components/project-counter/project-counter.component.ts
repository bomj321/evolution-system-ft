import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-project-counter',
  templateUrl: './project-counter.component.html'
})
export class ProjectCounterComponent {

  @Input() tasks = [];
  constructor() {
  }
}
