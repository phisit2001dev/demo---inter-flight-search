import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile';
import { AuthLoginUtilService } from '../services/auth-login-util-service';
import { SessionStorageService } from '../services/session-storage.service';
import { AuthStateService } from '../state';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthLoginGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private authService: AuthStateService,
    private sessionStorageService: SessionStorageService,
    private authLoginUtilService: AuthLoginUtilService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const json = this.sessionStorageService.getProfile();
    const params  = new URL(location.href)?.searchParams;
    if (this.sessionStorageService.getState() && params.get('p') && params.get('state')) {
      this.router.navigate([params.get('p')], { queryParams: {code: params.get('code'),state: params.get('state')} });
      return false;
    }else {
      if (json) {
        const profile: Profile = JSON.parse(json);
        // กรณีที่ ปิด browser แล้ว เปิดใหม่ akita จะมีค่าเป็น null จึงต้องทำการ set ใหม่ และ ไม่ this.sessionStorageService.setIsLogin() ที่ auth-login.guard เพราะมีการ navigate ไป home จะทำการ setIsLogin ที่ auth-guard
        this.authService.setAuthState(profile.language);
        this.router.navigate([environment.firstPage]);
      }else {
        this.authLoginUtilService.initLogin();
      }
      return true;
    }
  }

  canLoad(): boolean {
    const url = this.router.getCurrentNavigation().extractedUrl;
    const isAuth = this.sessionStorageService.getIsLogin();
    if (isAuth) {
      return isAuth;
    } else {
      this.router.navigate(['/login'], { queryParams: { path: url } });
      return isAuth;
    }
  }
}
