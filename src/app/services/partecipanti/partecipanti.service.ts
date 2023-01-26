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

    async mutationUpdateGraphQL(operation, inputType, variables, whereItem, whereValue, whereType) {
        const mutation = `
mutation ($variables: ${inputType}!, $whereValue: ${whereType}!) {
    ${operation}(where: {${whereItem}: {_eq: $whereValue}}, _set: $variables) {
        affected_rows
    }
}
`;

        return await this.httpClient.post('https://fisioair.hasura.app/v1/graphql',
            {query: mutation, variables: {variables, whereValue}},
            {headers: {'Content-Type': 'application/json', 'x-hasura-admin-secret': environment.hasuraSecret}})
            .toPromise();
    }

    async mutationInsertGraphQL(operation, inputType, variables) {
        const mutation = `
mutation ($variables: ${inputType}!) {
    ${operation}(objects: [$variables]) {
        affected_rows
    }
}
`;

        return await this.httpClient.post('https://fisioair.hasura.app/v1/graphql',
            {query: mutation, variables: {variables}},
            {headers: {'Content-Type': 'application/json', 'x-hasura-admin-secret': environment.hasuraSecret}})
            .toPromise();
    }

    async getAllGraphQL(table, params) {
        const query = `
query {
  ${table} {
    ${params}
  }
}
`;
        return await this.httpClient.post('https://fisioair.hasura.app/v1/graphql', {
                query
            },
            {
                headers: {
                    'Content-Type': 'application/vnd.pgrst.object+json',
                    'x-hasura-admin-secret': environment.hasuraSecret
                }
            }
        ).toPromise();
    }

    async getSpecificGraphQL(table, params, whereItem, whereValue, whereType) {
        const query = `
query myQuery($whereValue: ${whereType}!) {
  ${table}(where: {${whereItem}: {_eq: $whereValue}}) {
    ${params}
  }
}
`;
        return await this.httpClient.post('https://fisioair.hasura.app/v1/graphql',
            {query, variables: {whereValue}},
            {
                headers: {
                    'Content-Type': 'application/vnd.pgrst.object+json',
                    'x-hasura-admin-secret': environment.hasuraSecret
                }
            }
        ).toPromise();
    }
}
