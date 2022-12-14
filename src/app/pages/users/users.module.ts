import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FormsModule} from '@angular/forms';
import {BsDropdownModule, TooltipModule} from 'ngx-bootstrap';
import {UsersComponent} from './users.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DebounceModule} from 'ngx-debounce';

export const routes = [
    {path: '', component: UsersComponent, pathMatch: 'full'},
];

@NgModule({
    declarations: [
        UsersComponent,
    ],
    exports: [
        UsersComponent
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
export class UsersModule {
    static routes = routes;
}
