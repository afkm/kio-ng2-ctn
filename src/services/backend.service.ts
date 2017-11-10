import { Injectable, Inject, Optional } from '@angular/core'
import { Http , Response } from '@angular/http'
import { Observable , ReplaySubject , AsyncSubject } from 'rxjs'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/timeout'

import { 
  KioQuery, KioNode, KioQueryResult,
  KioContentType,
  KioCtnSrc, KioCtnTxt, KioCtnFragment,
  nodeType, nodeTypeByName,
  KioContentModel, KioNodeModel, KioQueryModel/*,
  debugging*/
} from 'kio-ng2-data'
import { XHRWorkerClient } from 'kio-ng2-worker'
import { worker } from '../worker/worker'
import { CtnConfig, CtnApiConfig } from '../interfaces/ctn-config'
import { CTN_CONFIG } from '../config-provider'
import { MockingProvider, MockedData } from '../interfaces/mocking-provider'
import { MOCKING_PROVIDER } from '../mocking-provider'
import { CtnLogger } from '../classes/Logger.class'

@Injectable()
export class BackendService {

  constructor(
      protected http:Http, 
      @Optional() @Inject(MOCKING_PROVIDER) private mockingService:MockingProvider, 
      @Optional() @Inject(CTN_CONFIG) private config:CtnConfig
    )
  { 
    this.apiConfig = Object.assign({
        post_url: 'https://pb8i8ysw33.execute-api.eu-central-1.amazonaws.com/v2/api',
        get_url: 'https://kioget.37x.io',
        timeout: (1000 * 10),
        cache_ttl: (1000 * 60)
      },
      config.api || {})
  }

  protected apiConfig:CtnApiConfig
  private cache : Map<string,Observable<KioQueryResult>> = new Map()
  private errorLogger:CtnLogger = new CtnLogger()
  public workerClient:XHRWorkerClient=new XHRWorkerClient(worker)


  private parseResponse ( response:Response , node:KioContentModel ):any {
    const responseData:any = response.json()
    return this.parseResponseData(responseData,node)
  }

  private parseResponseData ( responseData:any , node:KioContentModel ):any {
      if ( node.type === 'txt' )
      return {data: responseData}

    responseData = responseData || {}
    
    const dataKeys:string[] = Object.keys(responseData)
    if ( dataKeys.length > 0 )
      return responseData

    if ( !this.mockingService ) {
      throw Error ( `No mocking service provided. Please do so by using MOCKING_PROVIDER.` )
    }
    return this.mockingService.mockContentData ( node )
  }

  private _queryNode ( node : KioContentModel, contentParams:any ) : Observable<KioQueryResult> {
    const query : KioQuery = this.buildNodeQuery(node,contentParams)
    return this.http.post ( this.apiConfig.post_url , query )
        .timeout(this.apiConfig.timeout)
        .map ( (response) => this.mapResponseData ( query , this.parseResponse(response,node) ) )
        .catch ( ( error:Response|any ) => {
          let errorMsg:string
          if ( error instanceof Response ) {
            const body = error.json()
            const err = body.error || JSON.stringify(body)
            errorMsg = `${error.status} - ${error.statusText || ''} ${err}`
          } else {
            errorMsg = error.message ? error.message : error.toString()
          }
          this.errorLogger.logError ( errorMsg, node )
          console.groupCollapsed('Backend error')
          console.trace('Node: ', node )
          console.log ( 'Failed to load content with query: ' + JSON.stringify(query) )
          console.groupEnd()
          return Observable.throw(errorMsg)
        } )
  }

  private mapResponseData ( query : KioQuery , responseData:any ) : KioQueryResult {
    return ({
      success: true ,
      error: null,
      query,
      data: responseData
    })
  }

  private post ( url:string, query?:any ) {
    if ( this.config.useWebWorker !== false ) {
    
      return this.workerClient.request ( {
        method: 'POST',
        url: url,
        data: JSON.stringify(query)
      } ).map ( (data:any) => {
        return data.response
      } )

    }
    
    return this.http.post(url , query)
              .map ( response => response.json() )
  }

  loadMockedData( node : KioContentModel , contentParams:any ) : Observable<KioQueryResult> {
    const query : KioQuery = this.buildNodeQuery(node,contentParams)
    const data = this.mockingService.mockContentData (node,contentParams)
    const responseData : KioQueryResult = this.mapResponseData ( query , data )

    const t = 200 * (1+Math.floor(Math.random()*10))
    return Observable.from(Promise.resolve(responseData)).delay(t)
  }

  private buildNodeQuery ( node:KioContentModel, params:any ) : KioQuery {
    const query = KioQueryModel.fromNode ( <KioNodeModel>node )
    if ( params.locale )
    {
      query.locale = params.locale
    }
    else
    {
      query.locale = this.config.localeProvider.current
    }
    query.params = params
    return query
  }

  loadNodeContent ( node : KioContentModel , contentParams:any , ttl:number=this.apiConfig.cache_ttl ) : Observable<KioQueryResult> {
    if ( /^\[mock/.test(node.cuid) )
      return this.loadMockedData ( node , contentParams )

    if ( node.type === 'txt' ) {
      return this.requestGet(`${this.apiConfig.get_url}/txt/${node.cuid}/${this.config.localeProvider.current}`).map ( response => {
        return this.parseResponseData ( response, node )
      } )
    }

    const query:KioQuery = this.buildNodeQuery(node, contentParams)
    const tStart = Date.now()
    return this._queryNode(node,contentParams).map ( result => {
      return result
    } )
    .catch ( (error:any) => {
      this.errorLogger.logError ( error, node )
      return Observable.throw(error)
    } )
  }

  load ( query : KioQuery, ttl:number=this.apiConfig.cache_ttl ) : Observable<KioQueryResult> {
    query.locale = this.config.localeProvider.current
    return this.post ( this.apiConfig.post_url, query ).map ( ( response ) => {
      const parsed = this.mapResponseData ( query, response )
      return parsed
    } )
  }


  protected requestGet ( url:string ) {

    if ( this.config.useWebWorker !== false ) {
      return this.workerClient.request({
        url,
        method: 'GET',
        responseType: 'json'
      }).mergeMap ( data => {

        if ( 'error' in data ) {
          return Observable.throw(new Error(data['error']))
        } else {
          return Observable.of(data['response'])
        }

      } )
    }

    return this.http.get(url).map ( response => response.json() )

  }

  /*protected logger=window.afkm.logger.cloneToScope(this,{
    labelStyle: {
      fontSize: 'large'
    }
  })*/
}
