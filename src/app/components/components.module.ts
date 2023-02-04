import {NgModule} from '@angular/core';
import {GenericConfirmComponent} from './generic-confirm/generic-confirm.component';
import {FileUploadModule} from 'ng2-file-upload';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {RouterModule} from '@angular/router';
import {ModalModule, TimepickerModule, TooltipModule} from 'ngx-bootstrap';
import {AgmCoreModule} from '@agm/core';
import {MatCheckboxModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, MatRadioModule} from '@angular/material';
import {MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';
import {ResizeImageComponent} from './resize-image/resize-image.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {CKEditorModule} from 'ngx-ckeditor';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {NewUploaderComponent} from './new-uploader/new-uploader.component';
import {AngularFileUploaderModule} from 'angular-file-uploader';

@NgModule({
    declarations: [
        GenericConfirmComponent,
        ResizeImageComponent,
        NewUploaderComponent
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
        CKEditorModule,
        DragDropModule,
        NgbPaginationModule,
        AngularFileUploaderModule,
    ],
    providers: [],
    exports: [
        GenericConfirmComponent,
        ResizeImageComponent,
        NewUploaderComponent
    ],
    entryComponents: [],
})
export class ComponentsModule {
}
