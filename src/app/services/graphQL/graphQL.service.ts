import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class GraphQLService {
    // this.partecipantiService.getAllGraphQL('fisio_partecipanti', 'id');
    //
    // this.partecipantiService.getSpecificGraphQL('fisio_partecipanti',
    //     'id cod_fisc cognome created_at disciplina libprof_dip nome professione',
    //     'id',
    //     63,
    //     'Int'
    // );
    //
    // this.partecipantiService.mutationInsertGraphQL(
    //     'insert_fisio_partecipanti',
    //     'fisio_partecipanti_insert_input',
    //     {nome: 'ciao2', cod_fisc: 'ciaone2'});
    //
    // this.partecipantiService.mutationUpdateGraphQL(
    //     'update_fisio_partecipanti',
    //     'fisio_partecipanti_set_input',
    //     {nome: 'ciaone2'},
    //     'cod_fisc',
    //     'ciaone',
    //     'String');
    //
    // this.partecipantiService.mutationDeleteGraphQL(
    //     'delete_fisio_partecipanti',
    //     'id',
    //     143,
    //     'Int'
    // );

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

        return await this.httpClient.post('https://fisioair.hasura.app/v1/graphql',
            {query: mutation, variables: {variables}},
            {headers: {'Content-Type': 'application/json', 'x-hasura-admin-secret': environment.hasuraSecret}})
            .toPromise();
    }

    /**
     *
     * @param table es: "fisio_partecipanti"
     * @param params es: "id cod_fisc cognome created_at disciplina libprof_dip nome professione"
     */
    async getAllGraphQL(table, params) {
        const query = `
query {
  ${table} {
    ${params}
  }
}
`;
        return await this.httpClient.post('https://fisioair.hasura.app/v1/graphql?' + table, {
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

    /**
     * @param table eg: "fisio_partecipanti"
     * @param params eg: "id cod_fisc cognome created_at disciplina libprof_dip nome professione"
     * @param whereItem eg: "id"
     * @param whereValue es: 64
     * @param whereType es: "Int"
     */
    async getSpecificGraphQL(table, params, whereItem, whereValue, whereType) {
        const query = `
query myQuery($whereValue: ${whereType}!) {
  ${table}(where: {${whereItem}: {_eq: $whereValue}}) {
    ${params}
  }
}
`;
        return await this.httpClient.post('https://fisioair.hasura.app/v1/graphql?' + table,
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
