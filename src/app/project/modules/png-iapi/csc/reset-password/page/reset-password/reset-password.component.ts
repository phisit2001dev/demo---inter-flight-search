import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Permission } from '@app/common/models/permission';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthQuery, AuthStateService } from '@app/project/core/state';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { ResetPasswordService } from '../../service/reset-password.service';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, switchMap, tap } from 'rxjs';
import { InputPasswordValidationService } from '@app/project/core/services/input-password-validation.service';
import { ConfirmDialogComponent } from '@app/project/shared/components/confirm-dialog/confirm-dialog.component';
import { environment } from 'environments/environment';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';
import { MainNavService } from '@app/project/core/services/main-nav.service';
import { AuthService } from '@app/project/core/services/auth.service';
import { CommonResponse } from '@app/common/models/common-response';
import { AuthLoginUtilService } from '@app/project/core/services/auth-login-util-service';
import { AppError } from '@app/common/errors/app-error';
import { TimezoneService } from '@app/project/core/services/timezone.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [ManualDetectionService, InputPasswordValidationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy{

  form: FormGroup;
  permission: Permission;
  defaultValue: any;
  payload: any;
  hide = true;
  passwordValidation = [];
  timeZoneList = [];

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private formBuilder: FormBuilder,
    private service: ResetPasswordService,
    private route: ActivatedRoute,
    private passwordService : InputPasswordValidationService,
    private cdf: ChangeDetectorRef,
    private sessionStorageService: SessionStorageService,
    public readonly navService: MainNavService,
    private authService: AuthService,
    private authLoginUtilService: AuthLoginUtilService,
    private authStateService: AuthStateService,
    private router: Router,
    private timeZoneService: TimezoneService,
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit() {
    super.onInitial();

    this.payload = this.route.snapshot.data.init.payload;
    this.permission = this.payload.permission;
    this.passwordValidation = this.passwordService.getConfigPassword(this.payload.passwordRemark);

    this.form = this.formBuilder.group({
      username: [this.sessionStorageService.getProfile() ? JSON.parse(this.sessionStorageService.getProfile()).username : '', {updateOn: 'blur',validators: SITValidators.isRequire}],
      password: ['', {validators: SITValidators.isRequire}],
      timeZoneVal: ['', {updateOn: 'blur',validators: SITValidators.isRequire}],
      timeZoneKey: [this.payload ? this.payload.userProfile.timeZone : '', {updateOn: 'blur',validators: SITValidators.isRequire}]
    });

    this.form.get('timeZoneKey').setValue(this.payload.userProfile.timeZone);
    this.defaultValue = this.form.value;
  }

  ngAfterViewInit() {
    this.spinner.hide();
  }

  ngOnDestroy() {
    super.onDestroy();
    this.mds$.destroy();
  }

  changePassword() {
    // validate require
    if (this.form.get('password').invalid) {
      this.snackbarService.open(this.translate.instant('10002'), 'W');
      this.form.get('password').markAsTouched();
      return;
    }

    this.spinner.show();
    this.service.changePwd(this.form.controls.password.value).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if(res.componentType === 'S' && res.displayStatus === 'S') {
        this.logout();
      }
      this.spinner.hide();
      this.handleResponse(res);
    });
  }

  changeTimezone() {
    // validate require
    if (this.form.get('timeZoneKey').invalid) {
      this.snackbarService.open(this.translate.instant('10002'), 'W');
      this.form.get('timeZoneKey').markAsTouched();
      return;
    }

    this.dialog.open(ConfirmDialogComponent,{
      data: {'description': this.translate.instant('50003')}
    }).afterClosed().subscribe(result => {
      if(result) {
        this.spinner.show();
        this.service.changeTimeZone(this.form.controls.timeZoneKey.value).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if(res.componentType === 'S' && res.displayStatus === 'S' && this.form.get('timeZoneVal').value != '') { 
           this.timeZoneService.setTimeZone(this.form.get('timeZoneVal').value);
          }
          this.spinner.hide();
          this.handleResponse(res);
        });
      }
    });
  }

  selectTimeZone(e) {
    if(e.source.selected) {
      this.form.get('timeZoneVal').setValue(e.source.viewValue);
    }
  }
  
  logout() {
    this.spinner.show();
    this.navService
      .logoutProcess()
      .pipe(
        tap((_) => (this.navService.isLogout = true)),
        switchMap((obj) => this.authService.logout())
      )
      .subscribe(
        (resp: CommonResponse) => {
          if (resp.componentType === 'S' && resp.displayStatus === 'S') {
            sessionStorage.removeItem(environment.keyProfile);
            sessionStorage.clear();
            this.authStateService.setAuthState(null);
            this.authLoginUtilService.initLogin();
          }
        },
        (error: AppError) => {
          this.spinner.hide();
          throw error;
        }
      );
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
