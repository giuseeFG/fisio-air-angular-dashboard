import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FormsModule} from '@angular/forms';
import {BsDropdownModule, TooltipModule} from 'ngx-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DebounceModule} from 'ngx-debounce';
import {ProfessioniComponent} from './professioni.component';

export const routes = [
    {path: '', component: ProfessioniComponent, pathMatch: 'full'},
];

@NgModule({
    declarations: [
        ProfessioniComponent,
    ],
    exports: [
        ProfessioniComponent
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
export class ProfessioniModule {
    static routes = routes;
}
