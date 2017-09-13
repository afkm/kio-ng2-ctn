import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { KioQuery, KioQueryResult, KioContentModel } from 'kio-ng2-data';
import { CtnConfig } from '../interfaces/ctn-config';
import { MockingProvider } from '../interfaces/mocking-provider';
export declare class BackendService {
    protected http: Http;
    private mockingService;
    private config;
    constructor(http: Http, mockingService: MockingProvider, config: CtnConfig);
    private cache;
    private errorLogger;
    private wrapAsync(subject);
    private parseResponse(response, node);
    private parseResponseData(responseData, node);
    private _queryNode(node, contentParams);
    private mapResponseData(query, responseData);
    private addQuery(cacheKey, observable, ttl);
    private post(url, query?);
    loadMockedData(node: KioContentModel, contentParams: any): Observable<KioQueryResult>;
    private buildNodeQuery(node, params);
    loadNodeContent(node: KioContentModel, contentParams: any, ttl?: number): Observable<KioQueryResult>;
    load(query: KioQuery, ttl?: number): Observable<KioQueryResult>;
}
