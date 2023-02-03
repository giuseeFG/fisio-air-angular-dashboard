import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class GraphQLService {

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    /**
     *
     * @param operation es: "update_fisio_partecipanti"
     * @param inputType es: "fisio_partecipanti_set_input"
     * @param variables es: "{nome: 'ciaone2'}"
     * @param whereItem es: "id"
     * @param whereValue es: 63
     * @param whereType es: "Int"
     */
    async mutationUpdateGraphQL(operation, inputType, variables, whereItem, whereValue, whereType) {
        const mutation = `
mutation ($variables: ${inputType}!, $whereValue: ${whereType}!) {
    ${operation}(where: {${whereItem}: {_eq: $whereValue}}, _set: $variables) {
        affected_rows
    }
}
`;

        return await this.httpClient.post('https://fisioair.hasura.app/v1/graphql?' + operation,
            {query: mutation, variables: {variables, whereValue}},
            {headers: {'Content-Type': 'application/json', 'x-hasura-admin-secret': environment.hasuraSecret}})
            .toPromise();
    }

    /**
     *
     * @param operation es: "update_fisio_partecipanti"
     * @param inputType es: "fisio_partecipanti_set_input"
     * @param variables es: "{nome: 'ciaone2'}"
     * @param whereItem es: "id"
     * @param whereValue es: 63
     * @param whereType es: "Int"
     */
    async mutationDeleteGraphQL(operation, whereItem, whereValue, whereType) {
        const mutation = `
mutation ($whereValue: ${whereType}!) {
    ${operation}(where: {${whereItem}: {_eq: $whereValue}}) {
        affected_rows
    }
}
`;

        return await this.httpClient.post('https://fisioair.hasura.app/v1/graphql',
            {query: mutation, variables: {whereValue}},
            {headers: {'Content-Type': 'application/json', 'x-hasura-admin-secret': environment.hasuraSecret}})
            .toPromise();
    }

    /**
     * @param operation es: "insert_fisio_partecipanti"
     * @param inputType es: "fisio_partecipanti_insert_input"
     * @param variables es: "{nome: 'ciao2', cod_fisc: 'ciaone2'}"
     */
    async mutationInsertGraphQL(operation, inputType, variables) {
        const mutation = `
mutation ($variables: ${inputType}!) {
    ${operation}(objects: [$variables]) {
        affected_rows
    }
}
`;

        return await this.httpClient.post('https://fisioair.hasura.app/v1/graphql?' + operation,
            {query: mutation, variables: {variables}},
            {headers: {'Content-Type': 'application/json', 'x-hasura-admin-secret': environment.hasuraSecret}})
            .toPromise();
    }

    async getFisioPartecipanti() {
        return await this.httpClient.get('https://fisioair.hasura.app/api/rest/partecipanti').toPromise();
    }

    async getFisioProfessioni() {
        return await this.httpClient.get('https://fisioair.hasura.app/api/rest/professioni').toPromise();
    }

    async getFisioDiscipline() {
        return await this.httpClient.get('https://fisioair.hasura.app/api/rest/discipline').toPromise();
    }

    async getFisioRelatori() {
        return await this.httpClient.get('https://fisioair.hasura.app/api/rest/relatori').toPromise();
    }

    async getFisioRelatore(id) {
        return await this.httpClient.post('https://fisioair.hasura.app/api/rest/relatore', {
            id
        }).toPromise();
    }

    async updateRelatore(data) {
        return await this.httpClient.post('https://fisioair.hasura.app/api/rest/updateRelatore', data).toPromise();
    }

    async insertRelatore(data) {
        return await this.httpClient.post('https://fisioair.hasura.app/api/rest/insertRelatore', data).toPromise();
    }

    async deleteRelatore(id) {
        return await this.httpClient.delete('https://fisioair.hasura.app/api/rest/deleteRelatore/' + id).toPromise();
    }

    async getDisciplina(codice) {
        return await this.httpClient.get('https://fisioair.hasura.app/api/rest/disciplina/' + codice).toPromise();
    }

    async getPartecipante(id) {
        return await this.httpClient.get('https://fisioair.hasura.app/api/rest/partecipante/' + id).toPromise();
    }

    async getDiscipline() {
        return await this.httpClient.get('https://fisioair.hasura.app/api/rest/discipline').toPromise();
    }

    async updateDisciplina(codice, data) {
        return await this.httpClient.post('https://fisioair.hasura.app/api/rest/updateDisciplina/' + codice, data).toPromise();
    }

    async insertDisciplina(data) {
        return await this.httpClient.post('https://fisioair.hasura.app/api/rest/insertDisciplina', data).toPromise();
    }
}
