import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, take } from 'rxjs';
import { Profile } from '../models/profile';
import { AuthService } from '../services/auth.service';
import { SessionStorageService } from '../services/session-storage.service';
import { SpinnerService } from '../services/spinner.service';
import { TimezoneService } from '../services/timezone.service';
import { AuthStateService } from '../state';
import { DialogUpdateVersionComponent } from '../components/dialog-update-version/dialog-update-version.component';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private authService: AuthStateService,
    private service: AuthService,
    public dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
    private timeZone: TimezoneService,
    private spinnerService: SpinnerService,

  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    return new Observable((subscriber) => {
      const json = this.sessionStorageService.getProfile();
      if (json) {
        // กรณี login สำเร็จหรือมีการ reload หน้าใหม่ จะต้อง next เพื่อว่าเมนู
        const profile: Profile = JSON.parse(json);
        this.sessionStorageService.setProfile(profile);
        if (this.timeZone.getTimeZone()) {
          this.timeZone.setTimeZone(this.timeZone.getTimeZone());
        }
        this.authService.setAuthState(profile.language);
        this.sessionStorageService.setIsLogin();
        subscriber.next(true);
      } else {
        if (next.queryParams.code && this.validateState(next.queryParams.state)) {
          this.service.getAccessToken(next.queryParams.code, this.sessionStorageService.getCvy()).pipe(take(1)).subscribe({
            next: (respTk) => {
              const _resp: any = respTk.body;
              if (_resp.access_token && _resp.refresh_token) {
                this.service.getProfile().pipe(take(1)).subscribe({
                  next: (resPf: any) => {
                    const profile = resPf?.data;
                    // #1
                    this.dialogUpdateVersion(profile);
                    // #2
                    this.configProfile(profile);
                    subscriber.next(true);
                  }
                })
              }else {
                this.authService.setAuthState(null);
                this.sessionStorageService.clearBrowserStorage();
                this.router.navigateByUrl('/login');
                subscriber.next(false);
              }
            }
          });
        }else {
          this.service.getProfile().pipe(take(1)).subscribe({
            next: (resPf: any) => {
              this.configProfile(resPf?.data);
              subscriber.next(true);
            }
          })
        }
      }
    });
  }

  configProfile(profile: Profile){
    if (profile.timeZone) {
      this.timeZone.setTimeZone(profile.timeZone);
      delete profile.timeZone;
    }
    this.authService.setAuthState(profile.language);
    this.sessionStorageService.setProfile(profile);
    this.sessionStorageService.setIsLogin();
  }

  canLoad(): boolean {
    // get url
    const url = this.router.getCurrentNavigation().extractedUrl;
    const isAuth = this.sessionStorageService.getIsLogin();
    if (isAuth) {
      return isAuth;
    } else {
      this.router.navigate(['/login'], { queryParams: { path: url } });
      return isAuth;
    }
  }

  validateState(state){
    return state === this.sessionStorageService.getState();
  }

  dialogUpdateVersion(profile: Profile){
    if (profile.changelogRead === 'Y') {
      delete profile.changelogRead;
      // Popup DialogUpdateVersion
      this.service.getDialogUpdateVersion().pipe(take(1)).subscribe((resp) => {
        this.dialog.open(DialogUpdateVersionComponent, {
          data: resp,
        });
      });
    }
  }

}
