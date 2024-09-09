import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SitButtonIconComponent } from '@app/project/shared/components/sit-button-icon/sit-button-icon.component';
import { ButtonIconPipe } from '@app/project/shared/pipes/button-icon.pipe';

@NgModule({
  declarations: [SitButtonIconComponent],
  imports: [CommonModule, ButtonIconPipe, MatButtonModule, MatIconModule, MatTooltipModule],
  exports: [SitButtonIconComponent],
})
export class SitButtonIconModule {}
