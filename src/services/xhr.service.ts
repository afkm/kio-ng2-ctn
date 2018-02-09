import { Observable } from 'rxjs'

import { EventEmitter, Injectable, Optional, Inject } from '@angular/core'
import { Http , Response } from '@angular/http'
import { CtnConfig, CtnApiConfig } from '../interfaces/ctn-config'
import { CTN_CONFIG } from '../config-provider'
import { IRequest } from '../interfaces/request'

export type CtnRequest = string|IRequest;
export type CtnPayload = [IRequest,Response];


@Injectable()
export class XHRService {

  constructor ( 
    private http:Http,
    @Optional() @Inject(CTN_CONFIG) private config:CtnConfig
  ) {

    if ( config && config.api && config.api.concurrencyLimit ) {
      this._bufferSize = config.api.concurrencyLimit
    }

    this._requestSubscription = this._requests.flatMap ( (request:IRequest) => {
      this._requestCount++
      return this._executeRequest(request)
    }, this._bufferSize )
    .subscribe ( ([request,response]) => {
      this._requestCount--
      this._requestCountTotal--
      //this._logStatus()
      this._responses.emit([request,response])
    } )

  }

  private _bufferSize:number

  private _requests:EventEmitter<IRequest>=new EventEmitter()
  
  private _responses:EventEmitter<[IRequest,Response]>=new EventEmitter()

  private _toggleRequests:EventEmitter<boolean>=new EventEmitter()

  private _executeRequest ( request:IRequest ):Observable<CtnPayload> {
    //console.log('Executing request', request)
    const {
      url,
      headers
    } = request
    return this.http.get(url,{headers}).map ( response => [request,response] )
  }

  waitForResponse ( waitRequest:IRequest ) {
    return this._responses.first ( ([request,response]) => {
      return request.url === waitRequest.url
    } ).map ( ([request,response]) => response )
  }

  requestGet ( request:CtnRequest ) {
    if ( 'string' === typeof request ) {
      return this.requestGet({url: request})
    }
    this._requestCountTotal++
    const result = this.waitForResponse(request)
    this._requests.emit(request)
    return result
  }

  private _requestCount:number=0
  private _requestCountTotal:number=0


  private _requestSubscription:any

  private _logStatus () {
    console.log('current requests - %s active, %s total', this._requestCount, this._requestCountTotal)
  }

}
