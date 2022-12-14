import {Component, EventEmitter, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {ImageTransform} from 'ngx-image-cropper';

@Component({
    selector: 'app-resize-image',
    templateUrl: './resize-image.component.html',
    styleUrls: ['./resize-image.component.scss']
})
export class ResizeImageComponent implements OnInit {
    cropDone: EventEmitter<any> = new EventEmitter();
    noCrop: EventEmitter<any> = new EventEmitter();
    hide: EventEmitter<any> = new EventEmitter();
    image;
    finalImage;
    aspectRatio;
    aspectRatioExampleText;
    canvasRotation = 0;
    transform: ImageTransform = {};

    constructor(
        public modalRef: BsModalRef
    ) {
    }

    ngOnInit() {
    }

    crop() {
        this.modalRef.hide();
        this.cropDone.emit({image: this.finalImage});
    }

    noCrop_() {
        this.modalRef.hide();
        this.noCrop.emit();
    }

    hideModal() {
        this.hide.emit();
        this.modalRef.hide();
    }

    getAspectRatio() {
        return parseFloat(this.aspectRatio);
    }

    rotateLeft() {
        this.canvasRotation--;
        this.flipAfterRotate();
    }

    rotateRight() {
        this.canvasRotation++;
        this.flipAfterRotate();
    }

    flipHorizontal() {
        this.transform = {
            ...this.transform,
            flipH: !this.transform.flipH
        };
    }

    flipVertical() {
        this.transform = {
            ...this.transform,
            flipV: !this.transform.flipV
        };
    }

    private flipAfterRotate() {
        const flippedH = this.transform.flipH;
        const flippedV = this.transform.flipV;
        this.transform = {
            ...this.transform,
            flipH: flippedV,
            flipV: flippedH
        };
    }
}
