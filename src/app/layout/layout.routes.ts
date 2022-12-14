import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {AppGuard} from '../guard/app.guard';

const routes: Routes = [
    {
        path: '', component: LayoutComponent, children: [
            {
                path: 'dashboard',
                loadChildren: '../pages/dashboard/dashboard.module#DashboardModule',
                canActivate: [AppGuard]
            },
            {
                path: 'users',
                loadChildren: '../pages/users/users.module#UsersModule',
                canActivate: [AppGuard]
            },
            {
                path: 'users/:id',
                loadChildren: '../pages/users/user-detail/user-detail.module#UserDetailModule',
                canActivate: [AppGuard]
            },
        ]
    }
];

export const ROUTES = RouterModule.forChild(routes);
