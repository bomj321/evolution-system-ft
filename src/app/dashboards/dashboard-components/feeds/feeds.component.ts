import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html'
})
export class FeedsComponent {
  constructor() {}
  @Input() tasks = [];
 
}
