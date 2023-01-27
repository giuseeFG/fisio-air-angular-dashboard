import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {UtilsService} from '../../services/utils/utils.service';
import {GraphQLService} from '../../services/graphQL/graphQL.service';
import {GenericConfirmComponent} from '../../components/generic-confirm/generic-confirm.component';
import {BsModalService} from 'ngx-bootstrap';

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
        private graphQLService: GraphQLService,
        private modalService: BsModalService
    ) {
    }

    async ngOnInit() {
        this.utilsService.loaderActive = true;
        const data: any = await this.graphQLService.getCustomGraphQL(`query MyQuery {
          fisio_partecipanti {
            cod_fisc
            cognome
            created_at
            disciplina
            id
            libprof_dip
            nome
            professione
            professione_detail {
              codice
              professione
            }
            discipline_detail {
              codice
              disciplina
              professione
            }
          }
        }`);
        this.partecipanti = data?.data?.fisio_partecipanti;
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
                title: 'Rimuovi utente',
                text: 'Confermi di voler disabilitare l\'utente?'
            }
        });
        bsModalRef.content.eventYes.subscribe(async res => {
            this.utilsService.loaderActive = true;
            const res1: any = await this.graphQLService.mutationDeleteGraphQL(
                'delete_fisio_partecipanti',
                'id',
                row.id,
                'Int'
            );
            this.utilsService.loaderActive = false;
            if (res1?.errors) {
                this.utilsService.showError();
                return;
            }
            if (res1?.data?.delete_fisio_partecipanti?.affected_rows) {
                this.utilsService.showMessage('Il partecipante è stato correttamente rimosso.', 'Ok');
                this.partecipanti = this.partecipanti.filter(user => user.id !== row.id);
            } else {
                this.utilsService.showError();
            }
        });
    }
}
