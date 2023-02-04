import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UtilsService} from '../../services/utils/utils.service';
import {BsModalService} from 'ngx-bootstrap';
import {GenericConfirmComponent} from '../../components/generic-confirm/generic-confirm.component';
import {ProfessioniService} from '../../services/professioni/professioni.service';

@Component({
    selector: 'app-professioni',
    templateUrl: './professioni.template.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./professioni.style.scss']
})
export class ProfessioniComponent implements OnInit {
    searchText = '';
    professioni;

    constructor(
        public utilsService: UtilsService,
        private modalService: BsModalService,
        private professioniService: ProfessioniService
    ) {
    }

    async ngOnInit() {
        this.utilsService.loaderActive = true;
        const data: any = await this.professioniService.getProfessioni();
        this.professioni = data?.fisio_professioni;
        this.utilsService.loaderActive = false;
    }

    getFilteredItems() {
        if (!this.searchText?.trim()?.length) {
            return this.professioni || [];
        }
        return this.utilsService.searchFunction(this.professioni || [], this.searchText);
    }

    removeProfessione(row) {
        const bsModalRef = this.modalService.show(GenericConfirmComponent, {
            initialState: {
                title: 'Rimuovi professione',
                text: 'Confermi di voler disabilitare la professione?'
            }
        });
        bsModalRef.content.eventYes.subscribe(async res => {
            this.utilsService.loaderActive = true;
            const res1: any = await this.professioniService.deleteProfessione(row.codice);
            this.utilsService.loaderActive = false;
            if (res1?.errors) {
                this.utilsService.showError();
                return;
            }
            if (res1?.delete_fisio_professioni?.affected_rows) {
                this.utilsService.showMessage('La professione è stata correttamente rimossa.', 'Ok');
                this.professioni = this.professioni.filter(user => user.id !== row.id);
            } else {
                this.utilsService.showError();
            }
        });
    }
}
