import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Permission } from '@app/common/models/permission';
import { TranslateService } from '@ngx-translate/core';
enum BUTTON_TYPE {
  SEARCH = 'S',
  ADD = 'A',
  VIEW = 'V',
  EDIT = 'E',
  EXPORT = 'EX',
  SEARCH_EXPORT = 'S-EX',
  UPLOAD = 'U'
}

@Component({
  selector: 'app-sit-button',
  templateUrl: './sit-button.component.html',
  styleUrls: ['./sit-button.component.scss'],
})
export class SitButtonComponent {

  @Input() page: BUTTON_TYPE.SEARCH | BUTTON_TYPE.ADD | BUTTON_TYPE.VIEW | BUTTON_TYPE.EDIT | BUTTON_TYPE.EXPORT | BUTTON_TYPE.UPLOAD | BUTTON_TYPE.SEARCH_EXPORT = null;
  @Input() permission: Permission;
  @Output() btnSearch = new EventEmitter();
  @Output() btnClear = new EventEmitter();
  @Output() btnSave = new EventEmitter();
  @Output() btnCancel = new EventEmitter();
  @Output() btnEdit = new EventEmitter();
  @Output() btnClose = new EventEmitter();
  @Output() btnExport = new EventEmitter();
  @Output() btnSubmit = new EventEmitter();
  @Output() btnBack = new EventEmitter();

  constructor(
    public translate: TranslateService,
    public snackbar: SnackbarService
  ) {}

  closeSnackbar(){
    this.snackbar?.getSnackbar().dismiss();
  }
}
