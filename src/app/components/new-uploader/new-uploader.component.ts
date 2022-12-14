import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ResizeImageComponent} from '../resize-image/resize-image.component';
import {UtilsService} from '../../services/utils/utils.service';
import {UploaderService} from '../../services/uploader/uploader.service';
import {environment} from '../../../environments/environment';
import {AngularFileUploaderComponent} from 'angular-file-uploader';

@Component({
    selector: 'app-new-uploader',
    templateUrl: './new-uploader.component.html',
    styleUrls: ['./new-uploader.component.scss']
})
export class NewUploaderComponent implements OnInit {
    @ViewChild('uploader', {static: false}) uploader: AngularFileUploaderComponent;
    @Input() aspectRatio;
    @Input() aspectRatioExampleText;
    @Output() onFileUploaded = new EventEmitter();
    @Input() autoUpload = false;
    @Input() customClass;
    @Input() destination;
    // @ts-ignore
    uploaderConfig: AngularFileUploaderConfig;

    format;
    filename;
    size;

    constructor(
        private modalRef: BsModalRef,
        private uploaderService: UploaderService,
        private utilsService: UtilsService,
        private modalService: BsModalService
    ) {
    }

    ngOnInit() {
        this.uploaderConfig = {
            formatsAllowed: '.jpg,.jpeg,.png',
            maxSize: 3,
            fileNameIndex: false,
            uploadAPI: {
                url: environment.basePath + '/upload',
                method: 'POST',
                headers: {
                    'X-S3-Bucket': 'tremiti',
                    'X-S3-Destination': this.destination,
                    'X-Api-Key': '9811730dfef2259725115126'
                },
                responseType: 'json',
                withCredentials: false,
            },
            theme: 'dragNDrop',
            hideProgressBar: false,
            hideResetBtn: false,
            hideSelectBtn: false,
            autoUpload: this.autoUpload,
            replaceTexts: {
                selectFileBtn: 'Seleziona file',
                resetBtn: 'Cancella',
                uploadBtn: 'Carica',
                dragNDropBox: 'Drag N Drop',
                attachPinBtn: 'Allega file...',
                afterUploadMsg_success: 'Upload effettuato!',
                afterUploadMsg_error: 'Upload fallito!',
                sizeLimit: 'Dimensione massima'
            }
        };

        setTimeout(() => {
            // if (!this.autoUpload) {
            //     const elements = document.getElementsByClassName(this.customClass);
            //     if (elements?.length) {
            //         const item = elements[0];
            //         const uploaderItem: any = item.getElementsByClassName('btn btn-success afu-upload-btn');
            //         if (uploaderItem?.length) {
            //             uploaderItem[0].style.display = 'none';
            //         }
            //     }
            // }
        });
    }

    clicked() {
        this.hide();
    }

    hide() {
        this.modalRef.hide();
    }

    getBase64Image(file, extension) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const bsModalRef2 = this.modalService.show(ResizeImageComponent, {
                backdrop: 'static',
                keyboard: false,
                class: 'modal-xl',
                initialState: {
                    image: reader.result,
                    aspectRatio: this.aspectRatio,
                    aspectRatioExampleText: this.aspectRatioExampleText
                }
            });

            bsModalRef2.content.cropDone.subscribe(async res1 => {
                console.log('cropped', res1);
                this.utilsService.loaderActive = true;
                this.uploader.allowedFiles[0] = this.getFileFromBase64(
                    res1.image.split(',')[1],
                    extension,
                    Date.now()
                );
                // if (this.autoUpload) {
                this.uploader.uploadFiles();
                // } else {
                //     this.utilsService.loaderActive = false;
                // }
            });

            bsModalRef2.content.noCrop.subscribe(async res1 => {
                // if (this.autoUpload) {
                this.uploader.uploadFiles();
                // }
            });

            bsModalRef2.content.hide.subscribe(async res1 => {
            });
        };
    }

    getFileFromBase64(dataurl, format, filename) {
        const bstr = atob(dataurl);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        const formData = new FormData();
        const blob = new Blob([u8arr], {type: 'image/' + format});
        formData.append(filename, blob);
        // @ts-ignore
        return formData.entries().next().value[1];
    }

    fileSelected(event) {
        setTimeout(() => {
            const extension = this.uploader.allowedFiles[0].type.split('/')[1];
            this.format = extension;
            this.filename = this.uploader.allowedFiles[0].name;
            this.size = this.uploader.allowedFiles[0].size;
            if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
                this.getBase64Image(this.uploader.allowedFiles[0], extension);
            } else {
                // if (this.autoUpload) {
                this.uploader.uploadFiles();
                // }
            }
        });
    }

    clearQueue() {
        this.uploader.allowedFiles = [];
    }

    fileUploaded(event) {
        this.onFileUploaded.emit({file: event, format: this.format, filename: this.filename, size: this.size});
        this.utilsService.loaderActive = false;
    }
}
