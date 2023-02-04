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
                path: 'nuovo-partecipante',
                loadChildren: '../pages/partecipanti/partecipante-detail/partecipante-detail.module#PartecipanteDetailModule',
                canActivate: [AppGuard]
            },
            {
                path: 'partecipanti',
                loadChildren: '../pages/partecipanti/partecipanti.module#PartecipantiModule',
                canActivate: [AppGuard]
            },
            {
                path: 'partecipanti/:id',
                loadChildren: '../pages/partecipanti/partecipante-detail/partecipante-detail.module#PartecipanteDetailModule',
                canActivate: [AppGuard]
            },
            {
                path: 'professioni',
                loadChildren: '../pages/professioni/professioni.module#ProfessioniModule',
                canActivate: [AppGuard]
            },
            {
                path: 'professioni/:codice',
                loadChildren: '../pages/professioni/professione-detail/professione-detail.module#ProfessioneDetailModule',
                canActivate: [AppGuard]
            },
            {
                path: 'nuova-professione',
                loadChildren: '../pages/professioni/professione-detail/professione-detail.module#ProfessioneDetailModule',
                canActivate: [AppGuard]
            },
            {
                path: 'discipline',
                loadChildren: '../pages/discipline/discipline.module#DisciplineModule',
                canActivate: [AppGuard]
            },
            {
                path: 'discipline/:codice',
                loadChildren: '../pages/discipline/disciplina-detail/disciplina-detail.module#DisciplinaDetailModule',
                canActivate: [AppGuard]
            },
            {
                path: 'nuova-disciplina',
                loadChildren: '../pages/discipline/disciplina-detail/disciplina-detail.module#DisciplinaDetailModule',
                canActivate: [AppGuard]
            },
            {
                path: 'relatori',
                loadChildren: '../pages/relatori/relatori.module#RelatoriModule',
                canActivate: [AppGuard]
            },
            {
                path: 'relatori/:id',
                loadChildren: '../pages/relatori/relatore-detail/relatore-detail.module#RelatoreDetailModule',
                canActivate: [AppGuard]
            },
            {
                path: 'nuovo-relatore',
                loadChildren: '../pages/relatori/relatore-detail/relatore-detail.module#RelatoreDetailModule',
                canActivate: [AppGuard]
            },
        ]
    }
];

export const ROUTES = RouterModule.forChild(routes);
