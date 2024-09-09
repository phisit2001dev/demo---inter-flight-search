import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { CommonSelectItem } from '@app/common/models/common-select-item';
import { Permission } from '@app/common/models/permission';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { Transaction } from '@app/project/shared/models/transaction';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { PrefixService } from '../../services/prefix.service';

@Component({
  selector: 'app-prefix-edit',
  templateUrl: './prefix-edit.component.html',
  styleUrls: ['./prefix-edit.component.scss'],
  providers: [ ManualDetectionService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrefixEditComponent extends AbstractComponent implements OnInit, OnDestroy, AfterViewInit {
  form:FormGroup;
  initialData: any;
  permission: Permission;
  transaction: Transaction;
  prefixTypeSelectItem = [];

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected validatorInput:  SitValidatorInputService,
    protected mds$: ManualDetectionService,
    public spinner: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cdf: ChangeDetectorRef,
    private service: PrefixService,
  ){
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit(): void {
    super.onInitial();
    this.initialData = this.route.snapshot.data.init.payload;
    this.prefixTypeSelectItem = this.initialData?.listPrefixType ?? [];
    this.permission = this.initialData?.permission;
    this.transaction = this.initialData?.prefix?.transaction;
    this.initialForm();
  }

  ngOnDestroy(): void {
    super.onDestroy();
    this.mds$.destroy();
  }

  ngAfterViewInit(): void {
    this.spinner.hide();
  }

  initialForm() {
    const option = { updateOn: 'blur', validators: SITValidators.isRequire };
    this.form = this.formBuilder.group({
      prefixName: [this.initialData?.prefix?.prefixName ?? '', option],  // Input
      abbreviation: [this.initialData?.prefix?.abbreviation ?? ''],      // Input
      remark: [this.initialData?.prefix?.remark ?? '', option],          // Input
      prefixType: [this.initialData?.prefix?.prefixType ?? '', option],  // Combo
      prefixTypeLabel: [this.initialData?.prefix?.prefixTypeLabel ?? ''],/// Label for event log
      activeStatus: [this.initialData?.prefix?.activeStatus == "Y" ? true : false],  // Checkbox
      hiddenToken: [this.initialData?.prefix?.hiddenToken ?? ''],
    });
  }

  edit() {
    if (this.form.invalid) {  /// Check invalid.
      this.form.markAllAsTouched();
      this.mds$.getNext();
      this.snackbarService.open(this.translate.instant('10002'), "W");  // Show snackbar.
      return;
    }

    /// Open confirm dialog.
    this.openConfirm('50004').afterClosed().pipe(takeUntil(this.destroy$)).subscribe((confirm) => {
      if (confirm) {
        this.spinner.show();  // Show spinner.

        /// Call API.
        this.service.updatePrefix(this.prepareFormData()).pipe(takeUntil(this.destroy$)).subscribe((resp) => {
          this.handleResponse(resp); // Show snackbar.

          if (resp?.displayStatus === 'S') {
            this.gotoSearchPage();

          } else {
            this.spinner.hide();  // Hide spinner.
          }
        });
      }
    });
  }

  private prepareFormData() {
    // If selected prefix type
    if (this.form.get("prefixType").value != "") {
      // Find value in selectItem.
      this.initialData?.listPrefixType.filter((prefix: CommonSelectItem) => {
        // Check match with key selected.
        if (prefix.key == this.form.get("prefixType").value) {
          // Set in from for show in log event
          this.form.get("prefixTypeLabel").setValue(prefix.value);
        }
      });
    }

    let {...formData}: any = { ...this.form.value };
    formData.activeStatus = formData.activeStatus ? "Y" : "N";
    return formData;
  }

  cancel() {
    /// Open confirm dialog.
    this.openConfirm('50010').afterClosed().pipe(takeUntil(this.destroy$)).subscribe((confirm) => {
      if (confirm) {
        this.spinner.show();  // Show spinner.
        this.gotoSearchPage();
      }
    });
  }

  gotoSearchPage() {
    this.router.navigate(['/iapi/master-data/prefix', 'search'], {relativeTo: this.route});
  }
}
