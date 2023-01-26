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
        // this.partecipantiService.getAllGraphQL('fisio_partecipanti', 'id');

        this.partecipantiService.getSpecificGraphQL('fisio_partecipanti',
            'id cod_fisc cognome created_at disciplina libprof_dip nome professione',
            'id',
            63,
            'Int'
        );

        // this.partecipantiService.mutationInsertGraphQL(
        //     'insert_fisio_partecipanti',
        //     'fisio_partecipanti_insert_input',
        //     {nome: 'ciao2', cod_fisc: 'ciaone2'});

        // this.partecipantiService.mutationUpdateGraphQL(
        //     'update_fisio_partecipanti',
        //     'fisio_partecipanti_set_input',
        //     {nome: 'ciaone2'},
        //     'cod_fisc',
        //     'ciaone',
        //     'String');

        this.fetchingData = false;
    }
}
