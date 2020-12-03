import { Component, Input } from '@angular/core';
import { differenceInDays } from 'date-fns';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html'
})
export class FeedsComponent {

  @Input() tasks = [];
  constructor() {}


  formatTime(task)
  {

    if(differenceInDays(new Date(task.exp + 'T00:00'), new Date()) == 1)
    {
      return 'Queda 1 día'
    }else if(differenceInDays(new Date(task.exp + 'T00:00'), new Date()) < 1)
    {
      return 'Queda menos de 1 día'      
    }else
    {
      return 'Queda más de 1 día'
    }



  }

}
