import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UtilsService} from '../../services/utils/utils.service';
import {GraphQLService} from '../../services/graphQL/graphQL.service';
import {BsModalService} from 'ngx-bootstrap';
import {GenericConfirmComponent} from '../../components/generic-confirm/generic-confirm.component';

@Component({
    selector: 'app-discipline',
    templateUrl: './discipline.template.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./discipline.style.scss']
})
export class DisciplineComponent implements OnInit {
    searchText = '';
    discipline;

    constructor(
        public utilsService: UtilsService,
        private graphQLService: GraphQLService,
        private modalService: BsModalService
    ) {
    }

    async ngOnInit() {
        this.utilsService.loaderActive = true;
        const data: any = await this.graphQLService.getAllGraphQL('fisio_discipline', 'codice disciplina professione');
        this.discipline = data?.data?.fisio_discipline;
        this.utilsService.loaderActive = false;
    }

    getFilteredItems() {
        if (!this.searchText?.trim()?.length) {
            return this.discipline || [];
        }
        return this.utilsService.searchFunction(this.discipline || [], this.searchText);
    }

    removeDisciplina(row) {
        const bsModalRef = this.modalService.show(GenericConfirmComponent, {
            initialState: {
                title: 'Rimuovi disciplina',
                text: 'Confermi di voler disabilitare la disciplina?'
            }
        });
        bsModalRef.content.eventYes.subscribe(async res => {
            this.utilsService.loaderActive = true;
            const res1: any = await this.graphQLService.mutationDeleteGraphQL(
                'delete_fisio_discipline',
                'codice',
                row.codice,
                'Int'
            );
            this.utilsService.loaderActive = false;
            if (res1?.errors) {
                this.utilsService.showError();
                return;
            }
            if (res1?.data?.delete_fisio_discipline?.affected_rows) {
                this.utilsService.showMessage('La disciplina è stata correttamente rimossa.', 'Ok');
                this.discipline = this.discipline.filter(user => user.id !== row.id);
            } else {
                this.utilsService.showError();
            }
        });
    }
}
