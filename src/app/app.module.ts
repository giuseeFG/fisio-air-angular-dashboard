import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {PreloadAllModules, RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {ROUTES} from './app.routes';
import {AppComponent} from './app.component';
import {AppConfig} from './app.config';
import {ErrorComponent} from './pages/base-pages/error/error.component';
import {AppInterceptor} from './app.interceptor';
import * as firebase from 'firebase';
import {environment} from '../environments/environment';
import {BsModalRef, ModalModule, TimepickerModule} from 'ngx-bootstrap';
import {ComponentsModule} from './components/components.module';
import {AppGuard} from './guard/app.guard';
import {ComponentsTemplateModule} from './template-components/components-template.module';
import {LoaderModule} from './template-components/loader/loader.module';
import {HelperService} from './layout/helper/helper.service';
import {HelperComponent} from './layout/helper/helper.component';
import {NewWidgetModule} from './layout/new-widget/widget.module';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';

firebase.initializeApp(environment.firebaseConfig);
firebase.analytics();
firebase.performance();

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        ErrorComponent,
        HelperComponent
    ],
    imports: [
        ComponentsModule,
        ComponentsTemplateModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ModalModule.forRoot(),
        ToastrModule.forRoot(),
        TimepickerModule.forRoot(),
        RouterModule.forRoot(ROUTES, {
            useHash: true,
            preloadingStrategy: PreloadAllModules,
            relativeLinkResolution: 'legacy'
        }),
        LoaderModule,
        NewWidgetModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    providers: [
        HelperService,
        BsModalRef,
        AppGuard,
        AppConfig,
        {
            provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true
        },
    ]
})
export class AppModule {
}

