import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtService } from './jwt.service';
import { AuthService } from './auth.service';
import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private jwtService: JwtService, private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.jwtService.getToken()) {
      return of(true);
    } 
    // extract the token
    const token = route.queryParamMap.get('token');
    // if token then authenticated the user
    // if authenticated return true
    // otherwise return false
    if (token) {
      return this.authService.isAuthenticated(token)
      .pipe(
        map((authenticated) => {
          if (authenticated) {
                this.jwtService.setToken(token);
                this.router.navigate(['/dashboard', 'invoices']);
                return true;
            }
        }),
        catchError((err: any) => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    } else {
      this.router.navigate(['/login']);
      return of(false);
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
