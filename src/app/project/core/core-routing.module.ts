import { PngIapiModule } from './../modules/png-iapi/png-iapi.module';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { AuthLoginGuard } from './guards/auth-login.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@evn/environment';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', canActivate: [AuthLoginGuard], component: LoginComponent,},
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },

  {
    path: 'ex',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../modules/example/example.module').then(
        (m) => m.ExampleModule
      ),
  },
  {
    path: 'iapi',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../modules/png-iapi/png-iapi.module').then(
        (m) => m.PngIapiModule
      ),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('../modules/png-iapi/user-management/change-password/change-password.module').then(
        (m) => m.ChangePasswordModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
