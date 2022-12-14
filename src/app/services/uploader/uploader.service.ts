import {Injectable} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {UtilsService} from '../utils/utils.service';
import {environment} from '../../../environments/environment';
import {LoginService} from '../login/login.service';

@Injectable({
    providedIn: 'root'
})
export class UploaderService {

    constructor(
        private utilsService: UtilsService,
        private loginService: LoginService
    ) {
    }

    initUploader(options, onCompleteItem, onAfterAddingFile, onWhenAddingFileFailed, additionalParameters?) {
        const headers = [
            {
                name: 'Authorization',
                value: 'Bearer ' + options.token
            }
        ];
        // if (this.loginService.currentBrandID) {
        //     console.log('inside---->brand');
        //     headers.push({
        //         name: 'X-adpib-brand',
        //         value: this.loginService.currentBrandID + ''
        //     });
        // } else {
        //     headers.push({
        //         name: 'X-adpib-brand',
        //         value: 1 + ''
        //     });
        // }
        const uploader: FileUploader = new FileUploader({
            isHTML5: true,
            method: options.method,
            queueLimit: options.queueLimit,
            maxFileSize: options.maxFileSize,
            removeAfterUpload: true,
            allowedFileType: options.allowedFileType,
            url: environment.basePath + '/v1/media',
            headers
        });
        if (additionalParameters) {
            if (uploader.options.additionalParameter) {
                uploader.options.additionalParameter = {...uploader.options.additionalParameter, additionalParameters};
            } else {
                uploader.options.additionalParameter = additionalParameters;
            }
        }
        uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        };
        uploader.onCompleteItem = async (item, res, status) => {
            console.log('onCompleteItem', item, res, status);
            onCompleteItem(item, res, status);
        };
        uploader.onAfterAddingFile = (item) => {
            console.log('onAfterAddingFile', item);
            item.file.name = this.utilsService.normalizeFileName(item);
            onAfterAddingFile(item);
        };
        uploader.onWhenAddingFileFailed = (item, filter, options1) => {
            console.log('onWhenAddingFileFailed', item, filter, options1);
            onWhenAddingFileFailed(item, filter);
        };
        return uploader;
    }

    uploadAll(uploader) {
        uploader.uploadAll();
    }
}
