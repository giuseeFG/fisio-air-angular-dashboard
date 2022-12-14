import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilsService} from '../utils/utils.service';

@Injectable({
    providedIn: 'root'
})

export class TrainersService {
    trainers;
    allTrainersCount = 0;

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    async getTrainersCount() {
        const url = environment.basePath + `/trainers`;
        return await this.httpClient.get(url, {
            headers: {
                'Range': '0-99999999999',
                'Prefer': 'count=exact'
            },
            observe: 'response'
        }).toPromise()
            .then(res => {
                if (res?.headers?.get('content-range') && res?.headers?.get('content-range')[1]) {
                    this.allTrainersCount = Number(res.headers.get('content-range').split('/')[1]);
                }
            });
    }

    async getTrainer(id) {
        return this.httpClient.get(environment.basePath + '/trainers?id=eq.' + id, {
            headers: {
                'Accept': 'application/vnd.pgrst.object+json'
            }
        }).toPromise();
    }

    async updateTrainer(data) {
        data = {...UtilsService.trimAllFields(data)};
        return this.httpClient.patch(environment.basePath + '/trainers?id=eq.' + data.id, data).toPromise();
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

    async getTrainers(page) {
        const url = environment.basePath + `/trainers?limit=50&offset=${page}&order=created_at.desc`;
        return await this.httpClient.get(url).toPromise();
    }

    async deleteTrainer(id) {
        return await this.httpClient.delete(environment.basePath + `/trainers?id=eq.${id}`).toPromise();
    }

    async searchTrainers(phrase) {
        return await this.httpClient.get(environment.basePath + `/trainers?limit=10000&order=created_at.desc` +
            '&or=(first_name.ilike.' + phrase +
            '*,last_name.ilike.' + phrase +
            '*,email.ilike.' + encodeURI(phrase) +
            '*)')
            .toPromise();
    }
}
