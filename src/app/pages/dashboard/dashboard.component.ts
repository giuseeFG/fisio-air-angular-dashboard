import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../services/utils/utils.service';
import {PartecipantiService} from '../../services/partecipanti/partecipanti.service';
import {GraphQLService} from '../../services/graphQL/graphQL.service';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.template.html'
})
export class DashboardComponent implements OnInit {
    fetchingData = true;
    partecipanti;
    professioni;
    discipline;

    constructor(
        public utilsService: UtilsService,
        private graphQLService: GraphQLService
    ) {
    }

    async ngOnInit() {
        const data: any = await Promise.all([
            this.graphQLService.getAllGraphQL('fisio_partecipanti', 'id cod_fisc cognome created_at disciplina libprof_dip nome professione'),
            this.graphQLService.getAllGraphQL('fisio_professioni', 'codice professione'),
            this.graphQLService.getAllGraphQL('fisio_discipline', 'codice professione'),
        ]);
        this.partecipanti = data[0].data.fisio_partecipanti;
        this.professioni = data[1].data.fisio_professioni;
        this.discipline = data[2].data.fisio_discipline;

        this.fetchingData = false;
    }
}
