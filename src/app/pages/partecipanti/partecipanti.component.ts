import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UtilsService} from '../../services/utils/utils.service';
import {GenericConfirmComponent} from '../../components/generic-confirm/generic-confirm.component';
import {BsModalService} from 'ngx-bootstrap';
import {PartecipantiService} from '../../services/partecipanti/partecipanti.service';

@Component({
    selector: 'app-partecipanti',
    templateUrl: './partecipanti.template.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./partecipanti.style.scss']
})
export class PartecipantiComponent implements OnInit {
    searchText = '';
    partecipanti;

    constructor(
        public utilsService: UtilsService,
        private modalService: BsModalService,
        private partecipantiService: PartecipantiService
    ) {
    }

    async ngOnInit() {
        this.utilsService.loaderActive = true;
        const data: any = await this.partecipantiService.getPartecipanti();
        this.partecipanti = data?.fisio_partecipanti;
        this.utilsService.loaderActive = false;
    }

    getFilteredItems() {
        if (!this.searchText?.trim()?.length) {
            return this.partecipanti || [];
        }
        return this.utilsService.searchFunction(this.partecipanti || [], this.searchText);
    }

    removeUser(row) {
        const bsModalRef = this.modalService.show(GenericConfirmComponent, {
            initialState: {
                title: 'Rimuovi partecipante',
                text: 'Confermi di voler rimuovere il partecipante?'
            }
        });
        bsModalRef.content.eventYes.subscribe(async res => {
            this.utilsService.loaderActive = true;
            const res1: any = await this.partecipantiService.deletePartecipante(row.id);
            this.utilsService.loaderActive = false;
            if (res1?.errors) {
                this.utilsService.showError();
                return;
            }
            if (res1?.delete_fisio_partecipanti?.affected_rows) {
                this.utilsService.showMessage('Il partecipante è stato correttamente rimosso.', 'Ok');
                this.partecipanti = this.partecipanti.filter(user => user.id !== row.id);
            } else {
                this.utilsService.showError();
            }
        });
    }
}
