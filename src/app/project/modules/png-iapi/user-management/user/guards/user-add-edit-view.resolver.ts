import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { MainNavService } from '@app/project/core/services/main-nav.service';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserAddEditViewResolver 
implements Resolve<Observable<any>> {
  constructor(
    public router: Router,
    private service: UserService,
    private navService: MainNavService,
    private snackBar: SnackbarService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<any> | Observable<Observable<any>> | Promise<Observable<any>> {
      const page = route.queryParamMap.get('page');
      const token = route.queryParamMap.get('hiddenToken');
      const user = route.queryParamMap.get('element'); //ดึงค่าที่ได้จากหน้า audit-log
      switch (page) {

        case 'add': {
          return this.service.gotoAdd().pipe(
            map((resp) => {
              if (!resp.error) {
                this.navService.currentSys = resp.data.currentSys;
              } else {
                this.snackBar.open(resp.messageDesc, resp.displayStatus);
                this.router.navigate(['../home']);
      
              }
              return { payload: resp.data, acToken: resp.actionToken, pagetype: 'A',username:user };
            })
          );
        }

        case 'edit': {
          if (!token) {
            this.router.navigate(['/home']);
          }
          return this.service.gotoEdit(token).pipe(
            map((resp) => {
              if (!resp.error) {
                this.navService.currentSys = resp.data.currentSys;
              } else {
                this.snackBar.open(resp.messageDesc, resp.displayStatus);
                this.router.navigate(['../home']);
      
              }
              return { payload: resp.data, acToken: resp.actionToken, pagetype: 'E' ,username:user};
            })
          );
        }

        case 'view': {
          if (!token) {
            this.router.navigate(['/home']);
          }
          return this.service.gotoView(token).pipe(
            map((resp) => {
              if (!resp.error) {
                this.navService.currentSys = resp.data.currentSys;
              } else {
                this.snackBar.open(resp.messageDesc, resp.displayStatus);
                this.router.navigate(['../home']);
      
              }
              return { payload: resp.data, acToken: resp.actionToken, pagetype: 'V',username:user };
            })
          );
        }

        default: {
          this.router.navigate(['/home']);
          break;
        }
      }
  }
}
