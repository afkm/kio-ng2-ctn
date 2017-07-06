import { Injectable, Inject } from '@angular/core'
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
} from 'kio-ng2'
import { ContentMockingService } from 'kio-ng2-component-routing'
import { CtnConfig } from '../interfaces/ctn-config'
import { CTN_CONFIG } from '../config-provider'

const API_URL = 'https://pb8i8ysw33.execute-api.eu-central-1.amazonaws.com/v2/api'
//const API_URL = 'https://vaskbde08f.execute-api.eu-central-1.amazonaws.com/stage/api'
const API_TIMEOUT = 10 * 1000
//const API_URL = 'https://kioctn-agenturfuerkrank.netdna-ssl.com/api'

const getCacheKey = ( query : KioQuery ) : string => {
  return query.locale + '_' + query.cuid + ( query.params ? ('['+JSON.stringify(query.params)+']') : '' )
}

const CACHE_TTL = 1000 * 60

let QueryCache : Map<string,Observable<KioQueryResult>> = new Map()

const addQueryToCache = ( queryKey : string , subject : ReplaySubject<KioQueryResult> , ttl:number=CACHE_TTL) => {
  QueryCache.set(queryKey,subject)
  setTimeout(()=>{
    QueryCache.delete(queryKey)
    subject.complete()
  }, ttl )
}


@Injectable()
export class BackendService {

  constructor(
      protected http:Http, 
      private mockingService:ContentMockingService, 
      @Inject(CTN_CONFIG) private config:CtnConfig
    )
  { 
    
  }

  private cache : Map<string,Observable<KioQueryResult>> = new Map()

  private wrapAsync ( subject : Observable<KioQueryResult> ) : Observable<KioQueryResult> {
    const replayResult = new ReplaySubject(2,null)
    const loadSubscription = subject.subscribe ( 
        ( queryResult ) => {
          replayResult.next ( queryResult )
        } ,
        ( error ) => replayResult.error ( error ) ,
        () => {
          loadSubscription.unsubscribe()
        }
       )
    return replayResult
  }

  private parseResponse ( response:Response , node:KioContentModel ):any {
    const responseData:any = response.json()
    return this.parseResponseData(responseData,node)
  }
  private parseResponseData ( responseData:any , node:KioContentModel ):any {
      if ( node.type === 'txt' )
      return responseData

    responseData = responseData || {}
    
    const dataKeys:string[] = Object.keys(responseData)
    if ( dataKeys.length > 0 )
      return responseData

    return this.mockingService.mockContentData ( node )
  }

  private _queryNode ( node : KioContentModel, contentParams:any ) : Observable<KioQueryResult> {
    const query : KioQuery = this.buildNodeQuery(node,contentParams)
    return this.http.post ( API_URL , query )
        .timeout(API_TIMEOUT)
        .map ( (response) => this.mapResponseData ( query , this.parseResponse(response,node) ) )
        /*.publishReplay(1,CACHE_TTL)
        .refCount()*/
        .catch ( ( error:Response|any ) => {
          let errorMsg:string
          if ( error instanceof Response ) {
            const body = error.json()
            const err = body.error || JSON.stringify(body)
            errorMsg = `${error.status} - ${error.statusText || ''} ${err}`
          } else {
            errorMsg = error.message ? error.message : error.toString()
          }
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


  }

  private addQuery ( cacheKey:string, observable:Observable<KioQueryResult> , ttl:number ) {
    //addQueryToCache ( cacheKey , this.wrapAsync(observable) , ttl )
  }

  private post ( url:string, query?:any ) {
    return this.http.post ( url , query )
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

  loadNodeContent ( node : KioContentModel , contentParams:any , ttl:number=CACHE_TTL ) : Observable<KioQueryResult> {
    if ( /^\[mock/.test(node.cuid) )
      return this.loadMockedData ( node , contentParams )

    const query:KioQuery = this.buildNodeQuery(node, contentParams)
    const tStart = Date.now()
    return this._queryNode(node,contentParams).map ( result => {
      return result
    } )
  }

  load ( query : KioQuery, ttl:number=CACHE_TTL ) : Observable<KioQueryResult> {
    query.locale = this.config.localeProvider.current
    return this.post ( API_URL, query ).map ( ( response ) => {
      const parsed = this.mapResponseData ( query, response )
      return parsed
    } )
  }

}
