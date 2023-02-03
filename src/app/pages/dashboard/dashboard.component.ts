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
            this.graphQLService.getFisioPartecipanti(),
            this.graphQLService.getFisioProfessioni(),
            this.graphQLService.getFisioDiscipline(),
            this.graphQLService.getFisioRelatori(),
        ]);
        this.partecipanti = data[0].fisio_partecipanti;
        this.professioni = data[1].fisio_professioni;
        this.discipline = data[2].fisio_discipline;
        this.relatori = data[3].fisio_relatori_anag;

        this.fetchingData = false;
    }
}
