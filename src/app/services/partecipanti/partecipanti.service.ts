import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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
        data = {...UtilsService.trimAllFields(data)};
        return this.httpClient.patch(environment.basePath + '/partecipanti?id=eq.' + data.id, data).toPromise();
    }

    getPartecipanti() {
        return this.httpClient.get(environment.basePath + '/partecipanti', {
            headers: {
                'Content-Type': 'application/vnd.pgrst.object+json',
                'x-hasura-admin-secret': 'ypxo8CN93eqe013kjTIisoG5t928BnvAes4Xi4ijpgumKA7be2mUhZD3KfiFp2ia'
            }
        }).toPromise();
    }

    async getPartecipante(id) {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('x-hasura-admin-secret', environment.hasuraSecret);
        return await this.httpClient.post(environment.basePath + '/partecipanti/' + id, {}, {headers}).toPromise();
    }
}
