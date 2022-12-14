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

export class UserService {
    users;
    allUsersCount = 0;

    constructor(
        private httpClient: HttpClient,
        private utilsService: UtilsService,
        private loginService: LoginService
    ) {
    }

    async getUser(id) {
        return this.httpClient.get(environment.basePath + '/users?id=eq.' + id, {
            headers: {
                "Accept": "application/vnd.pgrst.object+json"
            }
        }).toPromise()
    }

    async updateUser(data) {
        data = {...UtilsService.trimAllFields(data)};
        // return this.httpClient.patch(environment.basePath + '/users?id=eq.' + this.loginService.user.id, data).toPromise()
        return this.httpClient.patch(environment.basePath + '/users?id=eq.' + data.id, data).toPromise()
    }

    updateDevice(device) {
        return this.httpClient.post(environment.basePath + '/device', device).toPromise();
    }

    async forgotPwd(email) {
        return this.httpClient.post(environment.basePath + '/forgot', {
            email: email.toLowerCase().trim(),
            reset_link: 'https://dashboard.bikerface.nxtcloud.it/#/reset-pwd-app'
        }).toPromise()
    }

    async resetPwd(data) {
        data = UtilsService.trimAllFields(data);
        return this.httpClient.post(environment.basePath + '/reset', data).toPromise()
    }

    async registerUser(data) {
        data = UtilsService.trimAllFields(data);
        return this.httpClient.post(environment.basePath + '/signup', data,
            {
                headers: {
                    Prefer: 'return=representation',
                    Accept: 'application/vnd.pgrst.object+json'
                }
            }
        ).toPromise();
    }

    async createCredentials(data) {
        data = UtilsService.trimAllFields(data);
        return this.httpClient.post(environment.basePath + '/auth/register', data,
            {
                headers: {
                    Prefer: 'return=representation'
                }
            }
        ).toPromise();
    }

    async getNotifications() {
        return this.httpClient.get(environment.basePath + '/notifications').toPromise();
    }

    async getRegisteredEvents() {
        return this.httpClient.get(environment.basePath + '/myevents').toPromise();
    }

    async addToFavourite(id) {
        return await this.httpClient.post(environment.basePath + `/favourite?content=${id}`, {}).toPromise();
    }

    async removeFromFavourite(id) {
        return await this.httpClient.delete(environment.basePath + `/unfavourite?content=eq.${id}&user=eq.${this.loginService.user.id}`).toPromise();
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

    async getUsers(page) {
        const url = environment.basePath + `/users?limit=50&offset=${page}&order=created_at.desc`;
        return await this.httpClient.get(url).toPromise();
    }

    async getRidePreference() {
        return await this.httpClient.get(environment.basePath + `/ride_preference?user=eq.${this.loginService.user.id}`).toPromise()
    }

    async insertRidePreference(data) {
        return await this.httpClient.post(environment.basePath + `/ride_preference`, data).toPromise();
    }

    async updateRidePreference(data) {
        return this.httpClient.patch(environment.basePath + '/ride_preference?user=eq.' + this.loginService.user.id, data).toPromise()
    }

    async deleteRidePreference(pref) {
        return await this.httpClient.delete(environment.basePath + `/ride_preference/${pref}`).toPromise();
    }

    async getSuggestions(type, additionalData) {
        switch (type) {
            case 'biker':
            case 'ballast':
                return await this.httpClient.get(environment.basePath + `/user_followers?category=eq.${type}&limit=100&order=count.desc&id=not.in.(${additionalData.join(',')})`).toPromise();
            case 'group':
                return await this.httpClient.get(environment.basePath + `/group_subscriptions?order=total.desc&limit=100&id=not.in.(${additionalData.join(',')})`).toPromise();
        }
    }

    async getUserFollowed() {
        return await this.httpClient.get(environment.basePath + `/follows?follower=eq.${this.loginService.user.id}`).toPromise();
    }

    async deleteUser(id) {
        return await this.httpClient.delete(environment.basePath + `/users?id=eq.${id}`).toPromise();
    }

    async deleteFirebaseUser(user) {
        return await this.httpClient.post(environment.firebaseBasePath + '/removeUser', {uid: user.firebaseId},
            {
                headers: {
                    // Authorization: 'key=' + environment.firebaseConfig.serverKey,
                    'Content-Type': 'application/json'
                }
            }).toPromise();
    }

    async getUsersCount() {
        const url = environment.basePath + `/users`;
        return await this.httpClient.get(url, {
            headers: {
                'Range': '0-99999999999',
                'Prefer': 'count=exact'
            },
            observe: 'response'
        }).toPromise()
            .then(res => {
                if (res?.headers?.get('content-range') && res?.headers?.get('content-range')[1]) {
                    this.allUsersCount = Number(res.headers.get('content-range').split('/')[1]);
                }
            });
    }

    async searchUsers(phrase) {
        return await this.httpClient.get(environment.basePath + `/users?limit=10000&order=created_at.desc` +
            '&or=(first_name.ilike.' + phrase +
            '*,last_name.ilike.' + phrase +
            '*,email.ilike.' + encodeURI(phrase) +
            '*)')
            .toPromise();
    }

    async getUserByEmail(email) {
        return this.httpClient.get(environment.basePath + '/users?email=eq.' + email, {
            headers: {
                "Accept": "application/vnd.pgrst.object+json"
            }
        }).toPromise()
    }

    async getUserWithDevice(id) {
        return this.httpClient.get(environment.basePath + `/users?id=eq.${id}&select=*,devices(regId)`, {
            headers: {
                "Accept": "application/vnd.pgrst.object+json"
            }
        }).toPromise()
            .catch(err => {
                return false;
            });
    }

    async sendUserNotification(to, title, body, additionalData) {
        let devices;
        const user: any = await this.getUserWithDevice(to);
        devices = user.devices;
        console.log('devices', devices)
        const notiData: {
            registrationToken?: string,
            payload: any,
            options?: any
        } = {
            payload: {
                notification: {
                    title,
                    body
                },
                data: {
                    additionalData: JSON.stringify(additionalData)
                }
            },
            options: {
                priority: 'high'
            }
        };
        if (devices?.length) {
            for (const device of devices) {
                notiData.registrationToken = device.regId;
                if (device) {
                    await this.httpClient.post(environment.firebaseBasePath + '/sendUserNotification', notiData,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).toPromise();
                }
            }
        } else {
            console.log('NO-DEVICES')
        }
        // if (toSave) {
        //     for (const userID of userIDS) {
        //         const data = {
        //             payload: notiData.payload,
        //             recipient: userID,
        //             sender: this.authService.user.id,
        //             type
        //         };
        //         this.httpClient.post(environment.basePath + '/notifications', data).toPromise();
        //     }
        // }
    }
}
