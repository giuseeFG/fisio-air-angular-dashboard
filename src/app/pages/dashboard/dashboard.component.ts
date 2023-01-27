import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../services/utils/utils.service';
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
    relatori;

    constructor(
        public utilsService: UtilsService,
        private graphQLService: GraphQLService
    ) {
    }

    async ngOnInit() {
        const data: any = await Promise.all([
            this.graphQLService.getAllGraphQL('fisio_partecipanti', 'id cod_fisc cognome created_at disciplina libprof_dip nome professione', 'created_at', 'asv'),
            this.graphQLService.getAllGraphQL('fisio_professioni', 'codice professione'),
            this.graphQLService.getAllGraphQL('fisio_discipline', 'codice professione'),
            this.graphQLService.getCustomGraphQL(`query MyQuery {
              fisio_relatori_anag {
                name
                struttura
                provenienza
                mobile
                id
                email
                disciplina
                created_at
                cod_fisc
                relatori {
                  struttura
                  name
                  id
                  disciplina
                  created_at
                }
              }
            }`),
        ]);
        this.partecipanti = data[0].data.fisio_partecipanti;
        this.professioni = data[1].data.fisio_professioni;
        this.discipline = data[2].data.fisio_discipline;
        this.relatori = data[3].data.fisio_relatori_anag;

        this.fetchingData = false;
    }
}
