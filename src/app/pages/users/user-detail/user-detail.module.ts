import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {UserDetailComponent} from './user-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ComponentsModule} from '../../../components/components.module';
import {TooltipModule} from 'ngx-bootstrap';
import {NewWidgetModule} from '../../../layout/new-widget/widget.module';

export const routes = [
    {path: '', component: UserDetailComponent, pathMatch: 'full'},
];

@NgModule({
    declarations: [
        UserDetailComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        NgxDatatableModule,
        ComponentsModule,
        ReactiveFormsModule,
        TooltipModule,
        NewWidgetModule
    ]
})
export class UserDetailModule {
    static routes = routes;
}
