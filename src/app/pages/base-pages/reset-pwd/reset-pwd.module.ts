import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AlertModule} from 'ngx-bootstrap';
import {ResetPwdComponent} from './reset-pwd.component';
import {LoaderModule} from "../../../template-components/loader/loader.module";
import {NewWidgetModule} from "../../../layout/new-widget/widget.module";
import {MatIconModule} from "@angular/material/icon";

export const routes = [
    {path: '', component: ResetPwdComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        ResetPwdComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        AlertModule.forRoot(),
        LoaderModule,
        ReactiveFormsModule,
        NewWidgetModule,
        MatIconModule
    ],
    providers: []
})
export class ResetPwdModule {
    static routes = routes;
}
