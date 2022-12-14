import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {UtilsService} from '../../services/utils/utils.service';
import {BsModalService} from 'ngx-bootstrap';
import {GenericConfirmComponent} from '../../components/generic-confirm/generic-confirm.component';
import {UserService} from '../../services/user/user.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.template.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./users.style.scss']
})
export class UsersComponent implements OnInit {
    @Input() fromPopup = false;
    searchText = '';
    users;
    page = 0;
    usersPerPage = 50;

    constructor(
        public utilsService: UtilsService,
        public userService: UserService,
        public modalService: BsModalService
    ) {
    }

    async ngOnInit() {
        this.utilsService.loaderActive = true;
        this.userService.getUsersCount();
        this.getUsers();
        this.utilsService.loaderActive = false;
    }

    async getUsers() {
        const data: any = await this.userService.getUsers(this.page)
            .catch(err => {
                this.utilsService.showError('C\'è stato un errore nel recuperare gli utenti');
            });
        if (data) {
            this.users = data;
        }
    }

    getFilteredItems() {
        return this.users || [];
    }

    async pageChanged(event) {
        this.page = event;
        this.getUsers();
    }

    async searchUser() {
        if (this.searchText?.length === 0) {
            this.getUsers();
            return;
        }
        if (this.searchText?.length <= 3) {
            return;
        }
        this.users = [];
        this.page = 0;
        this.performSearch();
    }

    async performSearch() {
        this.users = await this.userService.searchUsers(this.searchText);
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
            await this.userService.deleteFirebaseUser(row);
            await this.userService.deleteUser(row.id);
            this.utilsService.showMessage('L\'utente è stato correttamente rimosso.', 'Ok');
            this.users = this.users.filter(user => user.id !== row.id);
            this.utilsService.loaderActive = false;
        });
    }
}
