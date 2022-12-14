import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../services/utils/utils.service';
import {TrainersService} from '../../services/trainers/trainers.service';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.template.html'
})
export class DashboardComponent implements OnInit {
    fetchingData = true;

    constructor(
        public utilsService: UtilsService,
        public trainersService: TrainersService,
    ) {
    }

    async ngOnInit() {
        const data: any = await Promise.all([
            this.trainersService.getTrainersCount(),
        ]);
        this.fetchingData = false;
    }
}
