import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilsService} from '../utils/utils.service';
import {LoginService} from '../login/login.service';

@Injectable({
    providedIn: 'root'
})

export class RelatoriService {
    constructor(
        private httpClient: HttpClient,
        private utilsService: UtilsService,
        private loginService: LoginService
    ) {
    }
    async getRelatori() {
        return await this.httpClient.get(environment.basePath + '/relatori').toPromise();
    }

    async getRelatore(id) {
        return await this.httpClient.get(environment.basePath + '/relatore/' + id).toPromise();
    }

    async updateRelatore(data) {
        return await this.httpClient.patch(environment.basePath + '/relatore/' + data.id, data).toPromise();
    }

    async insertRelatore(data) {
        return await this.httpClient.post(environment.basePath + '/relatore', data).toPromise();
    }

    async deleteRelatore(id) {
        return await this.httpClient.delete(environment.basePath + '/relatore/' + id).toPromise();
    }
}
