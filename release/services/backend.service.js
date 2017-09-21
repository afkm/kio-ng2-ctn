import { Injectable, Inject, Optional } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { KioQueryModel /*,
debugging*/ } from 'kio-ng2-data';
import { CTN_CONFIG } from '../config-provider';
import { MOCKING_PROVIDER } from '../mocking-provider';
import { CtnLogger } from '../classes/Logger.class';
var KIO_TXT_URL = 'https://kioget.37x.io/txt';
var API_URL = 'https://pb8i8ysw33.execute-api.eu-central-1.amazonaws.com/v2/api';
//const API_URL = 'https://vaskbde08f.execute-api.eu-central-1.amazonaws.com/stage/api'
var API_TIMEOUT = 10 * 1000;
//const API_URL = 'https://kioctn-agenturfuerkrank.netdna-ssl.com/api'
var getCacheKey = function (query) {
    return query.locale + '_' + query.cuid + (query.params ? ('[' + JSON.stringify(query.params) + ']') : '');
};
var CACHE_TTL = 1000 * 60;
var QueryCache = new Map();
var addQueryToCache = function (queryKey, subject, ttl) {
    if (ttl === void 0) { ttl = CACHE_TTL; }
    QueryCache.set(queryKey, subject);
    setTimeout(function () {
        QueryCache.delete(queryKey);
        subject.complete();
    }, ttl);
};
var BackendService = (function () {
    function BackendService(http, mockingService, config) {
        this.http = http;
        this.mockingService = mockingService;
        this.config = config;
        this.cache = new Map();
        this.errorLogger = new CtnLogger();
    }
    BackendService.prototype.parseResponse = function (response, node) {
        var responseData = response.json();
        return this.parseResponseData(responseData, node);
    };
    BackendService.prototype.parseResponseData = function (responseData, node) {
        if (node.type === 'txt')
            return { data: responseData };
        responseData = responseData || {};
        var dataKeys = Object.keys(responseData);
        if (dataKeys.length > 0)
            return responseData;
        if (!this.mockingService) {
            throw Error("No mocking service provided. Please do so by using MOCKING_PROVIDER.");
        }
        return this.mockingService.mockContentData(node);
    };
    BackendService.prototype._queryNode = function (node, contentParams) {
        var _this = this;
        var query = this.buildNodeQuery(node, contentParams);
        return this.http.post(API_URL, query)
            .timeout(API_TIMEOUT)
            .map(function (response) { return _this.mapResponseData(query, _this.parseResponse(response, node)); })
            .catch(function (error) {
            var errorMsg;
            if (error instanceof Response) {
                var body = error.json();
                var err = body.error || JSON.stringify(body);
                errorMsg = error.status + " - " + (error.statusText || '') + " " + err;
            }
            else {
                errorMsg = error.message ? error.message : error.toString();
            }
            _this.errorLogger.logError(errorMsg, node);
            console.groupCollapsed('Backend error');
            console.trace('Node: ', node);
            console.log('Failed to load content with query: ' + JSON.stringify(query));
            console.groupEnd();
            return Observable.throw(errorMsg);
        });
    };
    BackendService.prototype.mapResponseData = function (query, responseData) {
        return ({
            success: true,
            error: null,
            query: query,
            data: responseData
        });
    };
    /*
    private _query ( query : KioQuery ) : Observable<KioQueryResult> {
        return this.http.post ( API_URL , query )
            .map ( (response) => this.mapResponseData ( query , response.json() ) )
            .catch ( ( error:Response|any ) => {
              let errorMsg:string
              if ( error instanceof Response ) {
                const body = error.json()
                const err = body.error || JSON.stringify(body)
                errorMsg = `${error.status} - ${error.statusText || ''} ${err}`
              } else {
                errorMsg = error.message ? error.message : error.toString()
              }
              console.error ( errorMsg )
              return Observable.throw(errorMsg)
            } )
    
    
      }*/
    BackendService.prototype.addQuery = function (cacheKey, observable, ttl) {
        //addQueryToCache ( cacheKey , this.wrapAsync(observable) , ttl )
    };
    BackendService.prototype.post = function (url, query) {
        return this.http.post(url, query)
            .map(function (response) { return response.json(); });
    };
    BackendService.prototype.loadMockedData = function (node, contentParams) {
        var query = this.buildNodeQuery(node, contentParams);
        var data = this.mockingService.mockContentData(node, contentParams);
        var responseData = this.mapResponseData(query, data);
        var t = 200 * (1 + Math.floor(Math.random() * 10));
        return Observable.from(Promise.resolve(responseData)).delay(t);
    };
    BackendService.prototype.buildNodeQuery = function (node, params) {
        var query = KioQueryModel.fromNode(node);
        if (params.locale) {
            query.locale = params.locale;
        }
        else {
            query.locale = this.config.localeProvider.current;
        }
        query.params = params;
        return query;
    };
    BackendService.prototype.loadNodeContent = function (node, contentParams, ttl) {
        var _this = this;
        if (ttl === void 0) { ttl = CACHE_TTL; }
        if (/^\[mock/.test(node.cuid))
            return this.loadMockedData(node, contentParams);
        if (node.type === 'txt') {
            return this.http.get(KIO_TXT_URL + "/" + node.cuid + "/" + this.config.localeProvider.current).map(function (response) {
                return _this.parseResponse(response, node);
            });
        }
        var query = this.buildNodeQuery(node, contentParams);
        var tStart = Date.now();
        return this._queryNode(node, contentParams).map(function (result) {
            return result;
        })
            .catch(function (error) {
            _this.errorLogger.logError(error, node);
            return Observable.throw(error);
        });
    };
    BackendService.prototype.load = function (query, ttl) {
        var _this = this;
        if (ttl === void 0) { ttl = CACHE_TTL; }
        query.locale = this.config.localeProvider.current;
        return this.post(API_URL, query).map(function (response) {
            var parsed = _this.mapResponseData(query, response);
            return parsed;
        });
    };
    return BackendService;
}());
export { BackendService };
/*protected logger=window.afkm.logger.cloneToScope(this,{
  labelStyle: {
    fontSize: 'large'
  }
})*/
BackendService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
BackendService.ctorParameters = function () { return [
    { type: Http, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MOCKING_PROVIDER,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [CTN_CONFIG,] },] },
]; };
//# sourceMappingURL=backend.service.js.map