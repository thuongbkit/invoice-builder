import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/components/auth.component';
import { NoAuthGuardService } from './core/services/no-auth-guard.service';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';

const routes: Routes = [
    {
        path: 'login',
        component: AuthComponent,
        canActivate: [NoAuthGuardService]
    },
    {
        path: 'signup',
        component: AuthComponent,
        canActivate: [NoAuthGuardService]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NoAuthGuardService]
    },
    {
        path: 'reset-password/:token',
        component: ResetPasswordComponent,
        canActivate: [NoAuthGuardService]
    },
    {
        path : 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
    }, {
        path: '**',
        redirectTo: 'dashboard'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
