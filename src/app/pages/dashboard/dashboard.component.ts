import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../services/utils/utils.service';
import {PartecipantiService} from '../../services/partecipanti/partecipanti.service';
import {ProfessioniService} from '../../services/professioni/professioni.service';
import {DisciplineService} from '../../services/discipline/discipline.service';
import {RelatoriService} from '../../services/relatori/relatori.service';

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
        private relatoriService: RelatoriService,
        private partecipantiService: PartecipantiService,
        private professioniService: ProfessioniService,
        private disciplineService: DisciplineService
    ) {
    }

    async ngOnInit() {
        const data: any = await Promise.all([
            this.partecipantiService.getPartecipanti(),
            this.professioniService.getProfessioni(),
            this.disciplineService.getDiscipline(),
            this.relatoriService.getRelatori(),
        ]);
        this.partecipanti = data[0].fisio_partecipanti;
        this.professioni = data[1].fisio_professioni;
        this.discipline = data[2].fisio_discipline;
        this.relatori = data[3].fisio_relatori_anag;

        this.fetchingData = false;
    }
}
