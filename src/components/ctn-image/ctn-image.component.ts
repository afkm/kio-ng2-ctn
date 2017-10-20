import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/delay'


import { 
  Component, EventEmitter, ViewChild, ElementRef, 
  OnChanges, SimpleChanges, SimpleChange,
  Input, Output
} from '@angular/core';

declare const Image:typeof HTMLImageElement

@Component({
  selector: 'ctn-image',
  templateUrl: './ctn-image.component.html',
  styleUrls: ['./ctn-image.component.css']
})
export class CtnImageComponent {

  @Output() loadStart:EventEmitter<null>=new EventEmitter<null>()
  @Output() load:EventEmitter<null>=new EventEmitter<null>()
  @Output() error:EventEmitter<null>=new EventEmitter<null>()

  @Input('src') src:string
  
  @Input() debug:boolean=false

  elementClass:string[]=['loading']
  loaded:boolean=false

  elementStartsToLoad ( ) {
    this.elementClass = [ 'loading' ]
    this.loaded = false
    this.loadStart.emit()
  }

  elementLoadProgress ( event:ProgressEvent ) {
    const p = (event.loaded / event.total) * 100
    //console.log('progress: %s', p )
  }

  elementDidLoad ( event:any ) {
    this.elementClass = ['loaded']
    this.loaded = true
    this.load.emit()
  }

  elementFailed ( event:any ) {
    this.elementClass = ['error']
    this.error.emit()
  }

}
