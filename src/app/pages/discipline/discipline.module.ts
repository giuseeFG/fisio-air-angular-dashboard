import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FormsModule} from '@angular/forms';
import {BsDropdownModule, TooltipModule} from 'ngx-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DebounceModule} from 'ngx-debounce';
import {DisciplineComponent} from './discipline.component';

export const routes = [
    {path: '', component: DisciplineComponent, pathMatch: 'full'},
];

@NgModule({
    declarations: [
        DisciplineComponent,
    ],
    exports: [
        DisciplineComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgxDatatableModule,
        FormsModule,
        NgbModule,
        BsDropdownModule,
        TooltipModule,
        DebounceModule
    ]
})
export class DisciplineModule {
    static routes = routes;
}
