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

    async getPartecipanti() {
        return await this.httpClient.get(environment.basePath + '/partecipanti').toPromise();
    }

    async getPartecipante(id) {
        return await this.httpClient.get('https://fisioair.hasura.app/api/rest/partecipante/' + id).toPromise();
    }

    async updatePartecipante(data) {
        return await this.httpClient.patch(environment.basePath + '/partecipante/' + data.id, {data}).toPromise();
    }

    async insertPartecipante(data) {
        return await this.httpClient.post(environment.basePath + '/partecipante', {data}).toPromise();
    }

    async deletePartecipante(id) {
        return await this.httpClient.delete('https://fisioair.hasura.app/api/rest/partecipante/' + id).toPromise();
    }
}
