import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SITValidators } from '@app/project/core/validators/sit.validator';

@Component({
  selector: 'sit-password-validation',
  templateUrl: './sit-password-validation.component.html',
  styleUrls: ['./sit-password-validation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SitPasswordValidationComponent implements OnChanges {

  @Input() list = [];
  @Input() control:FormControl;
  regExp = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.list && this.list.length > 0) {
      this.regExp = [];
      this.list.forEach((lst) => {
        this.regExp.push(lst.exp);
      });
    }
    if (changes?.control) {
      this.control.addValidators(SITValidators.passwordValidation(this.regExp));
        this.control.updateValueAndValidity();
    }
  }
}
