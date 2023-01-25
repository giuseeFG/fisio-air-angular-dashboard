import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {UtilsService} from '../../services/utils/utils.service';
import {BsModalService} from 'ngx-bootstrap';
import {PartecipantiService} from '../../services/partecipanti/partecipanti.service';

@Component({
    selector: 'app-partecipanti',
    templateUrl: './partecipanti.template.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./partecipanti.style.scss']
})
export class PartecipantiComponent implements OnInit {
    @Input() fromPopup = false;
    searchText = '';
    partecipanti;
    page = 0;
    usersPerPage = 50;

    constructor(
        public utilsService: UtilsService,
        public modalService: BsModalService,
        private partecipantiService: PartecipantiService
    ) {
    }

    async ngOnInit() {
        this.utilsService.loaderActive = true;
        const data: any = await this.partecipantiService.getPartecipanti();
        this.partecipanti = data.fisio_partecipanti;
        this.utilsService.loaderActive = false;
    }

    getFilteredItems() {
        if (!this.searchText?.trim()?.length) {
            return this.partecipanti || [];
        }
        return this.utilsService.searchFunction(this.partecipanti || [], this.searchText);
    }

    // removeUser(row) {
    //     const bsModalRef = this.modalService.show(GenericConfirmComponent, {
    //         initialState: {
    //             title: 'Rimuovi utente',
    //             text: 'Confermi di voler disabilitare l\'utente?'
    //         }
    //     });
    //     bsModalRef.content.eventYes.subscribe(async res => {
    //         this.utilsService.loaderActive = true;
    //         await this.userService.deleteFirebaseUser(row);
    //         await this.userService.deleteUser(row.id);
    //         this.utilsService.showMessage('L\'utente è stato correttamente rimosso.', 'Ok');
    //         this.users = this.users.filter(user => user.id !== row.id);
    //         this.utilsService.loaderActive = false;
    //     });
    // }
}
