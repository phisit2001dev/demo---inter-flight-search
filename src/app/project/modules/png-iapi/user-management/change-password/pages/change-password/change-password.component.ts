import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { ChangePasswordService } from '../../services/change-password.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthQuery } from '@app/project/core/state';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from '@app/common/models/permission';
import { InputPasswordValidationService } from '@app/project/core/services/input-password-validation.service';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { takeUntil } from 'rxjs';
import { AbstractComponent } from '@app/abstracts/abstract-component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [ManualDetectionService, InputPasswordValidationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent extends AbstractComponent
implements OnInit, AfterViewInit, OnDestroy{

  form: FormGroup;
  permission: Permission;
  defaultValue: any;
  payload: any;
  hide = true;
  passwordValidation = [];
  reNewKey: string;

  constructor(
    private formBuilder: FormBuilder,
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private route: ActivatedRoute,
    private spinner: SpinnerService,
    private service: ChangePasswordService,
    private passwordService : InputPasswordValidationService,
    private router : Router
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit() {
    this.reNewKey = this.route.snapshot.data.init.reNewKey;
    this.payload = this.route.snapshot.data.init.payload;
    this.permission = this.payload.permission;
    this.passwordValidation = this.passwordService.getConfigPassword(this.payload.passwordRemark);

    this.form = this.formBuilder.group({
      // ไม่ใช้ blur เนื่องจากต้องการให้ password มีการเปลื่ยนแปลง Hint เลยเมือ key ถูกต้อง
      password: ['', {validators: SITValidators.isRequire}],
    });
    this.defaultValue = this.form.value;
  }

  ngAfterViewInit() {
    this.spinner.hide();
  }

  ngOnDestroy(): void {
    super.onDestroy();
    this.mds$.destroy();
  }

  changePassword() {
    // validate require
    if (this.form.get('password').invalid) {
      this.snackbarService.open('Insufficient data', 'W');
      this.form.get('password').markAsTouched();
      return;
    }

    this.spinner.show();
    this.service.changePwd(this.reNewKey,this.form.controls.password.value).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if(res.componentType === 'S' && res.displayStatus === 'S') {
        // this.snackbarService.open('Save data completed.', 'S');
        this.form.get('password').setValue('');
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
