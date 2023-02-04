import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilsService} from '../utils/utils.service';
import {LoginService} from '../login/login.service';

@Injectable({
    providedIn: 'root'
})

export class DisciplineService {
    constructor(
        private httpClient: HttpClient,
        private utilsService: UtilsService,
        private loginService: LoginService
    ) {
    }

    async getDisciplina(codice) {
        return await this.httpClient.get(environment.basePath + '/disciplina/' + codice).toPromise();
    }

    async getDiscipline() {
        return await this.httpClient.get(environment.basePath + '/discipline').toPromise();
    }

    async updateDisciplina(codice, data) {
        return await this.httpClient.patch(environment.basePath + '/disciplina/' + codice, data).toPromise();
    }

    async insertDisciplina(data) {
        return await this.httpClient.post(environment.basePath + '/disciplina', {data}).toPromise();
    }

    async deleteDisciplina(codice) {
        return await this.httpClient.delete(environment.basePath + '/disciplina/' + codice).toPromise();
    }
}
