import { 
  Inject, Input, Directive, Output,
  EventEmitter,
  Optional, Host, HostListener, HostBinding,
  ViewContainerRef,
  ComponentRef,
  OnChanges, SimpleChanges, SimpleChange,
  AfterContentInit, AfterViewInit,
  OnInit, OnDestroy
} from '@angular/core'
import { BackendService } from '../services/backend.service'
import { KioContentModel, KioFragmentModel, KioPublicationModel, KioTxtData, KioSrcData } from 'kio-ng2-data'

@Directive({
  selector: '[ctn]'
})
export class DataDirective <T extends KioTxtData|KioSrcData> implements OnInit, OnDestroy, OnChanges, AfterContentInit, AfterViewInit {

  constructor(
    @Inject(BackendService) protected backend:BackendService
    ){

    /*setTimeout(()=>{
      const directives = (<any>window).dataDirectives = (<any>window).dataDirectives || {}
      directives[this.logger.id] = this
    },100)*/
  }

  @Input('ctn') public contentNode:KioContentModel|KioFragmentModel  

  //@Input('node') nodeData:KioContentModel|KioPublicationModel
  @Output('contentData') nodeContentData:EventEmitter<KioTxtData|KioSrcData>=new EventEmitter()

  ngOnInit () {
    /*this.logger.log('OnInit')*/
  }
  
  ngOnDestroy () {
    /*this.logger.log('OnDestroy')*/
  }

  ngOnChanges(changes:SimpleChanges){
    /*this.logger.log('changes', changes)*/
  }

  ngAfterContentInit(){
    /*this.logger.log('after content init')*/
  }

  ngAfterViewInit(){
    /*this.logger.log('after view init')*/
  }

  /*protected logger=window.afkm.logger.cloneToScope(this,{
    labelStyle: {
      fontSize: '16px',
      fontWeight: 'bold'
    }
  })*/



}