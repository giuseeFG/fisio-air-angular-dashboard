import {Routes} from '@angular/router';
import {ErrorComponent} from './pages/base-pages/error/error.component';
import {AppGuard} from './guard/app.guard';

export const ROUTES: Routes = [
    {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
    },
    {
        path: 'reset-pwd',
        loadChildren: () => import('./pages/base-pages/reset-pwd/reset-pwd.module').then(m => m.ResetPwdModule)
    },
    {
        path: 'reset-pwd-app',
        loadChildren: () => import('./pages/base-pages/reset-pwd/reset-pwd.module').then(m => m.ResetPwdModule)
    },
    {
        path: '',
        canActivate: [AppGuard],
        loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
    },
    {
        path: 'login', loadChildren: () => import('./pages/base-pages/login/login.module').then(m => m.LoginModule)
    },
    {
        path: 'error', component: ErrorComponent
    },
    {
        path: 'forgot-pwd',
        loadChildren: () => import('./pages/base-pages/forgot-pwd/forgot-pwd.module').then(m => m.ForgotPwdModule)
    },
    {
        path: '**', component: ErrorComponent
    }
];
