import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { map, take } from 'rxjs/operators';
import { API_BASE_URL, API_TOKEN } from './inputs';
import { RepositoryApi, ReposListForOrgParams, ReposListForOrgResponse } from './interfaces';

export function parseResponse(responseBody: any[]) {
  return {
    results: responseBody.map(r => ({
      name: r['name'],
    })),
  };
}

export class RepositoriesClient implements RepositoryApi {

  constructor(
    private readonly httpClient: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
    @Inject(API_TOKEN) private readonly token: string,
  ) {
  }

  listForOrg(params: ReposListForOrgParams): Observable<ReposListForOrgResponse> {
    const targetUrl = `${this.baseUrl}/orgs/${params.org}/repos`;
    return this.httpClient.get(targetUrl, {
      headers: new HttpHeaders({
        'Accept': 'application/vnd.github.v3+json,application/vnd.github.symmetra-preview+json',
        'Authorization': `token ${this.token}`, // FIXME: Load this token
      }),
      params: {
        'sort': 'updated',
      },
    }).pipe(map(r => parseResponse(<any[]>r)));
  }

}
