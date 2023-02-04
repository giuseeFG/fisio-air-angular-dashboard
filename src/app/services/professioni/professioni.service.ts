import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilsService} from '../utils/utils.service';
import {LoginService} from '../login/login.service';

@Injectable({
    providedIn: 'root'
})

export class ProfessioniService {
    constructor(
        private httpClient: HttpClient,
        private utilsService: UtilsService,
        private loginService: LoginService
    ) {
    }

    async getProfessioni() {
        return await this.httpClient.get(environment.basePath + '/professioni').toPromise();
    }

    async updateProfessione(data) {
        return await this.httpClient.patch(environment.basePath + '/professione/' + data.codice, {
            data
        }).toPromise();
    }

    async getProfessione(codice) {
        return await this.httpClient.get(environment.basePath + '/professione/' + codice).toPromise();
    }

    async insertProfessione(data) {
        return await this.httpClient.post(environment.basePath + '/professione', {data}).toPromise();
    }

    async deleteProfessione(codice) {
        return await this.httpClient.delete(environment.basePath + '/professione/' + codice).toPromise();
    }
}
