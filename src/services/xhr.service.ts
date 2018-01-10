import { Observable } from 'rxjs'

import { EventEmitter, Injectable, Optional, Inject } from '@angular/core'
import { Http , Response } from '@angular/http'
import { CtnConfig, CtnApiConfig } from '../interfaces/ctn-config'
import { CTN_CONFIG } from '../config-provider'

export type CtnRequest = string;
export type CtnPayload = [CtnRequest,Response];


@Injectable()
export class XHRService {

  constructor ( 
    private http:Http,
    @Optional() @Inject(CTN_CONFIG) private config:CtnConfig
  ) {

    if ( config && config.api && config.api.concurrencyLimit ) {
      this._bufferSize = config.api.concurrencyLimit
    }

    this._requestSubscription = this._requests.flatMap ( (request:CtnRequest) => {
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

  private _requests:EventEmitter<CtnRequest>=new EventEmitter()
  
  private _responses:EventEmitter<[CtnRequest,Response]>=new EventEmitter()

  private _toggleRequests:EventEmitter<boolean>=new EventEmitter()

  private _executeRequest ( request:CtnRequest ):Observable<CtnPayload> {
    //console.log('Executing request', request)
    return this.http.get(request).map ( response => [request,response] )
  }

  waitForResponse ( url:CtnRequest ) {
    return this._responses.first ( ([request,response]) => {
      return request === url
    } ).map ( ([request,response]) => response )
  }

  requestGet ( url:CtnRequest ) {
    this._requestCountTotal++
    const result = this.waitForResponse(url)
    this._requests.emit(url)
    return result
  }

  private _requestCount:number=0
  private _requestCountTotal:number=0


  private _requestSubscription:any

  private _logStatus () {
    console.log('current requests - %s active, %s total', this._requestCount, this._requestCountTotal)
  }

}
