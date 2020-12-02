import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class UrlAuthGuard implements CanActivate 
{
  constructor(
    private router: Router,
    private authService: AuthenticationService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
    {
      if(this.authService.isAuthenticated() && this.authService.isCurrentUser())
      {
        return true;
      }else
      {
        this.router.navigate(['/']);
        return false;

      }
  
  }
}
