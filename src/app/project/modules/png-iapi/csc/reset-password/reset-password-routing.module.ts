import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './page/reset-password/reset-password.component';
import { ResetPasswordResolver } from './guards/reset-password.resolver';
import { AuthGuard } from '@app/project/core/guards/auth.guard';

const routes: Routes = [
{
  path: 'reset-password',
  canActivate: [AuthGuard],
  resolve: { init: ResetPasswordResolver },
  component: ResetPasswordComponent,
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetPasswordRoutingModule { }
