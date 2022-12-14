import {Component, EventEmitter, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {UtilsService} from "../../services/utils/utils.service";
import {UserService} from "../../services/user/user.service";
import {GroupsService} from "../../services/groups/groups.service";

@Component({
    selector: 'app-new-page',
    templateUrl: './new-page.component.html',
    styleUrls: ['./new-page.component.scss']
})
export class NewPageComponent implements OnInit {
    pageCreated: EventEmitter<any> = new EventEmitter();
    title;

    constructor(
        private modalRef: BsModalRef,
        public utilsService: UtilsService,
        public userService: UserService,
        private groupsService: GroupsService
    ) {
    }

    ngOnInit() {
    }

    async yesClicked() {
        this.utilsService.loaderActive = true;
        await this.groupsService.insertPage({
            title: this.title.trim()
        });
        this.utilsService.loaderActive = false;
        this.hide();
        this.pageCreated.emit();
    }

    hide() {
        this.modalRef.hide();
    }
}
