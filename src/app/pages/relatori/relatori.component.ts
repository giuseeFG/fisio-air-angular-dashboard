import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UtilsService} from '../../services/utils/utils.service';
import {GraphQLService} from '../../services/graphQL/graphQL.service';
import {BsModalService} from 'ngx-bootstrap';
import {GenericConfirmComponent} from '../../components/generic-confirm/generic-confirm.component';

@Component({
    selector: 'app-relatori',
    templateUrl: './relatori.template.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./relatori.style.scss']
})
export class RelatoriComponent implements OnInit {
    searchText = '';
    relatori;

    constructor(
        public utilsService: UtilsService,
        private graphQLService: GraphQLService,
        private modalService: BsModalService
    ) {
    }

    async ngOnInit() {
        this.utilsService.loaderActive = true;
        const data: any = await this.graphQLService.getFisioRelatori();
        this.relatori = data?.fisio_relatori_anag;
        console.log(this.relatori);
        this.utilsService.loaderActive = false;
    }

    getFilteredItems() {
        if (!this.searchText?.trim()?.length) {
            return this.relatori || [];
        }
        return this.utilsService.searchFunction(this.relatori || [], this.searchText);
    }

    removeRelatore(row) {
        const bsModalRef = this.modalService.show(GenericConfirmComponent, {
            initialState: {
                title: 'Rimuovi relatore',
                text: 'Confermi di voler disabilitare il relatore?'
            }
        });
        bsModalRef.content.eventYes.subscribe(async res => {
            this.utilsService.loaderActive = true;
            const res1: any = await this.graphQLService.deleteRelatore(row.id);
            this.utilsService.loaderActive = false;
            if (res1?.errors) {
                this.utilsService.showError();
                return;
            }
            if (res1?.delete_fisio_relatori_anag?.affected_rows) {
                this.utilsService.showMessage('La professione è stata correttamente rimossa.', 'Ok');
                this.relatori = this.relatori.filter(user => user.id !== row.id);
            } else {
                this.utilsService.showError();
            }
        });
    }
}
