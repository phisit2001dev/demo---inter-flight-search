import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { environment } from '@evn/environment';
import { TranslateService } from '@ngx-translate/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent extends AbstractComponent
  implements OnInit, OnDestroy, AfterViewInit {

  @Input() form: FormGroup
  @Input() initData: any;
  @Input() view: boolean;
  @Input() disabledUsername: boolean;

  prefixList = [];
  prefixAutocomplete$ = new Subject();

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private cdf: ChangeDetectorRef,
    private service: UserService,

  ) {
    super(snackbarService, dialog, null, mds$, translate, authQuery);
  }

  ngOnInit(): void {
    super.onInitial();
    this.initAutocomplete();
  }

  initAutocomplete() {
    this.prefixAutocomplete$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((term: string) => {
          if (term && term.length >= environment.autocomplete.fillAtLeast) {
            return this.service.searchPrefix(term);
          }
          this.prefixList = [];
          this.cdf.markForCheck();
          return [];
        })
      )
      .subscribe((value: any) => {
        this.prefixList = value.data;
        this.cdf.markForCheck();
      });
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }

  ngAfterViewInit() {
    if (this.view) {
      this.form.get('doctypeRefUser').disable();
      this.form.get('organizationId').disable();
      this.form.get('lockStatus').disable();
      this.form.get('active').disable();
    }
  }

 
}
