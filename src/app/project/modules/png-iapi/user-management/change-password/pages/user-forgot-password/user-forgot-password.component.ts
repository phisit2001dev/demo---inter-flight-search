import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { Permission } from '@app/common/models/permission';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { TranslateService } from '@ngx-translate/core';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-forgot-password',
  templateUrl: './user-forgot-password.component.html',
  styleUrls: ['./user-forgot-password.component.scss'],
  providers: [ManualDetectionService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForgotPasswordComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy{

  form: FormGroup;
  permission: Permission;
  defaultValue: any;

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private formBuilder: FormBuilder,
    private service: ForgotPasswordService,
    private router: Router
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit() {
    super.onInitial();

    this.form = this.formBuilder.group({
      email: ['', {updateOn: 'blur', validators: [SITValidators.isRequire, SITValidators.isSingleEmail]}],
    });

    this.defaultValue = this.form.value;
  }

  ngAfterViewInit() {
    this.spinner.hide();
  }

  ngOnDestroy() {
    super.onDestroy();
    this.mds$.destroy();
  }

  send() {
    if (!this.form.get('email').value) {
      this.snackbarService.open('Insufficient data.', 'W');
      this.form.get('email').markAsTouched();
      return;
    }

    if (!this.form.valid) {
      this.snackbarService.open('Invalid Data. Please check again.', 'W');
      this.form.get('email').markAsTouched();
      return;
    }
    
    
    this.spinner.show();
    this.service.forgotPwd(this.form.controls.email.value).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if(res.componentType === 'S' && res.displayStatus === 'S') {
        // this.snackbarService.open('Save data completed.', 'S');
        this.form.get('email').setValue('');
        this.router.navigate(['/user/pageSuccess']);
      } else {
        this.router.navigate(['/user/pageNotFound']);
      }
      this.spinner.hide();
      // this.handleResponse(res);
      this.form.reset(this.defaultValue);
    });
  }
}
