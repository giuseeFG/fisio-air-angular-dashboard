import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilsService} from '../utils/utils.service';
import {LoginService} from '../login/login.service';

export enum UserRole {
    ADMIN = 'admin',
    BACKOFFICE = 'backoffice',
    AGENT = 'agent',
    EDITOR = 'editor'
}

@Injectable({
    providedIn: 'root'
})

export class PartecipantiService {
    partecipanti;
    allPartecipantiCount = 0;

    constructor(
        private httpClient: HttpClient,
        private utilsService: UtilsService,
        private loginService: LoginService
    ) {
    }

    async updatePartecipante(data) {
        return await this.httpClient.patch(environment.basePath + '/partecipanti/' + data.id, {data}, {
            headers: {
                'Content-Type': 'application/vnd.pgrst.object+json',
                'x-hasura-admin-secret': environment.hasuraSecret
            }
        }).toPromise();
    }

    getPartecipanti() {
        return this.httpClient.get(environment.basePath + '/partecipanti', {
            headers: {
                'Content-Type': 'application/vnd.pgrst.object+json',
                'x-hasura-admin-secret': environment.hasuraSecret
            }
        }).toPromise();
    }

    async getPartecipante(id) {
        return await this.httpClient.get(environment.basePath + '/partecipanti/' + id, {
            headers: {
                'Content-Type': 'application/vnd.pgrst.object+json',
                'x-hasura-admin-secret': environment.hasuraSecret
            }
        }).toPromise();
    }
}
