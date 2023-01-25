import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ComponentsModule} from '../../../components/components.module';
import {TooltipModule} from 'ngx-bootstrap';
import {NewWidgetModule} from '../../../layout/new-widget/widget.module';
import {PartecipanteDetailComponent} from './partecipante-detail.component';

export const routes = [
    {path: '', component: PartecipanteDetailComponent, pathMatch: 'full'},
];

@NgModule({
    declarations: [
        PartecipanteDetailComponent,
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
export class PartecipanteDetailModule {
    static routes = routes;
}
