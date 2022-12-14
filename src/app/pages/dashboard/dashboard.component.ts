import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../services/utils/utils.service';
import {UserService} from '../../services/user/user.service';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.template.html'
})
export class DashboardComponent implements OnInit {
    fetchingData = true;

    constructor(
        public utilsService: UtilsService,
        public userService: UserService,
    ) {
    }

    async ngOnInit() {
        const data: any = await Promise.all([
            this.userService.getUsersCount(),
        ]);
        this.fetchingData = false;
    }
}
