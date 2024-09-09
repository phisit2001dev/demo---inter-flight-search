import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ChangePasswordResolver } from './guards/change-password.resolver';
import { UserForgotPasswordComponent } from './pages/user-forgot-password/user-forgot-password.component';
import { ForgotPasswordResolver } from './guards/forgot-password.resolver';
import { PageSuccessComponent } from './pages/page-success/page-success.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'changepassword',
    component: ChangePasswordComponent,
    resolve: {init:ChangePasswordResolver},
  },
  {
    path: 'forgotpassword',
    component: UserForgotPasswordComponent,
    resolve: {init:ForgotPasswordResolver},
  },
  {
    path: 'pageSuccess',
    component: PageSuccessComponent
  },
  {
    path: 'pageNotFound',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangePasswordRoutingModule { }
