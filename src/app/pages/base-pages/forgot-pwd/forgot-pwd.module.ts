import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AlertModule} from 'ngx-bootstrap';
import {LoaderModule} from '../../../template-components/loader/loader.module';
import {ForgotPwdComponent} from './forgot-pwd.component';
import {NewWidgetModule} from '../../../layout/new-widget/widget.module';

export const routes = [
    {path: '', component: ForgotPwdComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        ForgotPwdComponent,
    ],
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
export class ForgotPwdModule {
    static routes = routes;
}
