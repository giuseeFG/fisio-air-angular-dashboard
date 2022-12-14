import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FormsModule} from '@angular/forms';
import {NewWidgetModule} from '../../layout/new-widget/widget.module';
import {DashboardComponent} from './dashboard.component';

export const routes = [
    {path: '', component: DashboardComponent, pathMatch: 'full'},
];

@NgModule({
    declarations: [
        DashboardComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgxDatatableModule,
        NewWidgetModule,
        FormsModule,
    ]
})
export class DashboardModule {
    static routes = routes;
}
