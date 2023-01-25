import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../services/utils/utils.service';
import {PartecipantiService} from '../../services/partecipanti/partecipanti.service';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.template.html'
})
export class DashboardComponent implements OnInit {
    fetchingData = true;
    partecipanti;

    constructor(
        public utilsService: UtilsService,
        public partecipantiService: PartecipantiService,
    ) {
    }

    async ngOnInit() {
        const data: any = await Promise.all([
            this.partecipantiService.getPartecipanti(),
        ]);
        this.partecipanti = data[0].fisio_partecipanti;
        this.fetchingData = false;
    }
}
