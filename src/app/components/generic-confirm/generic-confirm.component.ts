import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
    selector: 'app-generic-confirm',
    templateUrl: './generic-confirm.component.html',
    styleUrls: ['./generic-confirm.component.scss']
})
export class GenericConfirmComponent implements OnInit {
    title;
    text;
    eventYes: EventEmitter<any> = new EventEmitter();
    eventNo: EventEmitter<any> = new EventEmitter();
    yesText = 'Sì';
    noText = 'No';
    colorNo;
    colorYes;

    constructor(
        private modalRef: BsModalRef
    ) {
    }

    ngOnInit() {
    }

    yesClicked() {
        this.hide();
        this.eventYes.emit();
    }

    noClicked() {
        this.hide();
        this.eventNo.emit();
    }

    hide() {
        this.modalRef.hide();
    }
}
