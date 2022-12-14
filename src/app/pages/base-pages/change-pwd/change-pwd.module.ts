import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AlertModule} from 'ngx-bootstrap';
import {ChangePwdComponent} from './change-pwd.component';
import {LoaderModule} from '../../../template-components/loader/loader.module';
import {NewWidgetModule} from '../../../layout/new-widget/widget.module';

export const routes = [
    {path: '', component: ChangePwdComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        AlertModule.forRoot(),
        LoaderModule,
        ReactiveFormsModule,
        NewWidgetModule
    ]
})
export class ChangePwdModule {
    static routes = routes;
}
