import { SnackbarService } from './../../services/snackbar.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AppError } from '@app/common/errors/app-error';
import { CommonResponse } from '@app/common/models/common-response';
import { environment } from '@evn/environment';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, Subscription, interval, takeUntil } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { Profile } from '../../models/profile';
import { AuthLoginUtilService } from '../../services/auth-login-util-service';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner.service';
import { AuthQuery, AuthStateService } from '../../state';
import { MainNavService } from './../../services/main-nav.service';
import { SessionStorageService } from '../../services/session-storage.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavComponent implements OnInit, OnDestroy {
  flagAuth = false;
  version = '';
  flagSubscription$: Observable<any>;
  storeSub: Subscription;
  flagcout = false;
  isExpand = false;
  showChar;
  profile: Profile;
  private routerSubscript$: Subject<any> = new Subject();
  translateSub: Subscription;
  @ViewChild('drawer', { read: ElementRef, static: false }) eRef: ElementRef;
  @ViewChild(MatMenuTrigger) menuInfo: MatMenuTrigger;
  isLogin = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authStateService: AuthStateService,
    private authService: AuthService,
    public readonly authQuery: AuthQuery,
    public readonly navService: MainNavService,
    private translate: TranslateService,
    private spinnerService: SpinnerService,
    public cdf: ChangeDetectorRef,
    private route: ActivatedRoute,
    private snackbar: SnackbarService,
    private authLoginUtilService: AuthLoginUtilService,
    private sessionStorageService: SessionStorageService,

  ) { }

  ngOnInit() {
    this.initVersion();
    this.router.events
    .pipe(takeUntil(this.routerSubscript$))
    .subscribe((event) => {

        if(event instanceof NavigationStart){
          // ตรวจสอบว่าเป็น same route หรือไม่ ถ้าไม่จะเปิด spinner
          if(this.router.url.indexOf(event.url) == -1){
            this.spinnerService.show();
            this.snackbar.dismiss();
          }
        } else if(event instanceof NavigationEnd){
          this.createUserinfo();
        } else if(event instanceof NavigationCancel){ // ปิด spinner เมื่อ NavigationCancel จะเกิดขึ้นกรณี
          this.spinnerService.hide();
        }
      });

    // main menu
    // this.navService.doucmentClicked$.subscribe((value) => {
    //   if (!this.eRef.nativeElement.contains(value)) {
    //     this.navService.close();
    //   }
    // });

    // subscribe เพื่อรอข้อมูลที่ sessionStorage
    this.sessionStorageService.getIsLoginAsObS().pipe(takeUntil(this.routerSubscript$)).subscribe((value) => {
      if (value) {
        this.createUserinfo();
        this.isLogin = value;
      }
      this.cdf.markForCheck();
    });
  }

  createUserinfo(){
    const json = this.sessionStorageService.getProfile();
    if (json) {
      this.profile = JSON.parse(json);
      this.showChar = this.profile?.username?.charAt(0).toUpperCase();
      if (this.profile?.language) {
        this.translate.use(this.profile.language.toLowerCase());
      }
    }
  }

  initVersion() {
    this.http.get('assets/json/version.json').subscribe((data) => {
      // tslint:disable-next-line: no-string-literal
      this.version += ' ' + data['version'];
    });
  }

  logout() {
    this.spinnerService.show();
    this.navService
      .logoutProcess()
      .pipe(
        tap((_) => (this.navService.isLogout = true)),
        switchMap((obj) => this.authService.logout())
      )
      .subscribe(
        (resp: CommonResponse) => {
          if (resp.componentType === 'S' && resp.displayStatus === 'S') {
            this.menuInfo?.closeMenu();
            sessionStorage.removeItem(environment.keyProfile);
            sessionStorage.clear();
            // this.router.navigate(['/login']).finally(()=> {
            //   this.spinnerService.hide();
            // });
            // this.store.dispatch(new LoginFail(false));
            this.authStateService.setAuthState(null);
            this.authLoginUtilService.initLogin();
          }
        },
        (error: AppError) => {
          this.spinnerService.hide();
          throw error;
        }
      );
  }
  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
    this.routerSubscript$.next(true);
    this.routerSubscript$.complete();
  }

  gotoChangePassword(){
    this.router.navigate(['/iapi/csc/reset-password/reset-password'],
    {relativeTo: this.route});
    this.menuInfo?.closeMenu();
  }

  gotoManual(){
    window.open(`${environment.manualUrl}`, '_blank');
  }

  gotoHistory(){
    window.open(`${environment.historyUrl}`, '_blank');
  }

}
