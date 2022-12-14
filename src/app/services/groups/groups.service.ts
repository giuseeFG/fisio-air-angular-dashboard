import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class GroupsService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    async getGroups() {
        return await this.httpClient.get(environment.basePath + `/groups?select=*,posts(*)`).toPromise()
    }

    async getGroup(groupID) {
        return await this.httpClient.get(environment.basePath + `/groups?id=eq.${groupID}&select=*,posts(*,user(*))`,
            {
                headers: {
                    "Accept": "application/vnd.pgrst.object+json",
                    Prefer: 'return=representation',
                }
            }).toPromise();
    }

    async updateGroup(groupID, group) {
        return await this.httpClient.patch(environment.basePath + `/groups?id=eq.${groupID}`, group).toPromise();
    }

    async getGroupAdmins(groupID) {
        return await this.httpClient.get(environment.basePath + `/group_owners?group=eq.${groupID}&select=*,user:users(*)`).toPromise()
    }

    async removeAdminPage(groupID, userID) {
        return await this.httpClient.delete(environment.basePath + `/group_owners?group=eq.${groupID}&user=eq.${userID}`).toPromise()
    }

    async addAdminPage(group, user) {
        return await this.httpClient.post(environment.basePath + `/group_owners`, {
            group,
            user
        }).toPromise()
    }

    async getGroupCategories() {
        return await this.httpClient.get(environment.basePath + `/group_categories`).toPromise()
    }

    async insertPage(data) {
        return await this.httpClient.post(environment.basePath + `/groups`, data).toPromise()
    }

    async getInfoPosts(groupID) {
        return await this.httpClient.get(environment.basePath + `/group_info_posts?group=eq.${groupID}&select=*,post:posts(*)`).toPromise()
    }

}
