import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilsService} from '../utils/utils.service';

@Injectable({
    providedIn: 'root'
})

export class SitesService {
    sites;
    allSitesCount = 0;

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    async getSite(id) {
        return this.httpClient.get(environment.basePath + '/site?id=eq.' + id, {
            headers: {
                'Accept': 'application/vnd.pgrst.object+json'
            }
        }).toPromise();
    }

    async updateSite(data) {
        data = {...UtilsService.trimAllFields(data)};
        return this.httpClient.patch(environment.basePath + '/sites?id=eq.' + data.id, data).toPromise();
    }

    updateDevice(device) {
        return this.httpClient.post(environment.basePath + '/device', device).toPromise();
    }

    async forgotPwd(email) {
        return this.httpClient.post(environment.basePath + '/forgot', {
            email: email.toLowerCase().trim(),
            reset_link: 'https://dashboard.bikerface.nxtcloud.it/#/reset-pwd-app'
        }).toPromise();
    }

    async resetPwd(data) {
        data = UtilsService.trimAllFields(data);
        return this.httpClient.post(environment.basePath + '/reset', data).toPromise();
    }

    async search(phrase, type): Promise<any> {
        // return await this.httpClient.get(environment.basePath + '/user_bikes?category=eq.' + category +
        //     '&or=(first_name.ilike.' + phrase +
        //     '*,last_name.ilike.' + phrase +
        //     '*,nickname.ilike.' + phrase +
        //     '*,city.ilike.' + phrase +
        //     '*,brand.ilike.' + phrase +
        //     '*,model.ilike.' + phrase +
        //     '*,version.ilike.' + phrase +
        //     '*)&user=not.eq.' + this.loginService.user.id)
        //     .toPromise();

        // return await this.httpClient
        //     .get(
        //         environment.basePath
        //         + `/users?or=(first_name.phfts.${phrase},last_name.phfts.${phrase},nickname.phfts.${phrase},city.phfts.${phrase})&category=eq.${category}`
        //     ).toPromise();
    }

    async getSites(page) {
        const url = environment.basePath + `/sites?limit=50&offset=${page}&order=created_at.desc`;
        return await this.httpClient.get(url).toPromise();
    }

    async deleteSite(id) {
        return await this.httpClient.delete(environment.basePath + `/sites?id=eq.${id}`).toPromise();
    }

    async searchSites(phrase) {
        return await this.httpClient.get(environment.basePath + `/sites?limit=10000&order=created_at.desc` +
            '&or=(first_name.ilike.' + phrase +
            '*,last_name.ilike.' + phrase +
            '*,email.ilike.' + encodeURI(phrase) +
            '*)')
            .toPromise();
    }
}
