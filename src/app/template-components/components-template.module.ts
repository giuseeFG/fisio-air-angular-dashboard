import {NgModule} from '@angular/core';
import {FileUploadModule} from 'ng2-file-upload';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {RouterModule} from '@angular/router';
import {ModalModule, TimepickerModule, TooltipModule} from 'ngx-bootstrap';
import {AgmCoreModule} from '@agm/core';
import {
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatRadioModule
} from '@angular/material';
import {MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';
import {ImageCropperModule} from 'ngx-image-cropper';
import {LoaderFullComponent} from './loader-full/loader-full.component';
import {LoaderModule} from './loader/loader.module';

@NgModule({
    declarations: [
        LoaderFullComponent
    ],
    imports: [
        FileUploadModule,
        CommonModule,
        FormsModule,
        NgxDatatableModule,
        ReactiveFormsModule,
        RouterModule,
        ModalModule,
        AgmCoreModule,
        MatRadioModule,
        TimepickerModule,
        TooltipModule,
        MatDatepickerModule,
        MatInputModule,
        MatCheckboxModule,
        MatNativeDateModule,
        MatGoogleMapsAutocompleteModule,
        ImageCropperModule,
        LoaderModule
    ],
    providers: [],
    exports: [
        LoaderFullComponent
    ],
    entryComponents: [],
})
export class ComponentsTemplateModule {
}
