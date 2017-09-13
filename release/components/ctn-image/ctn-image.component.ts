import { 
  Component, EventEmitter, ViewChild, ElementRef, 
  Input, Output
} from '@angular/core';

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

  elementClass:string[]=['loading']
  loaded:boolean=false

  elementStartsToLoad ( ) {
    this.elementClass = [ 'loading' ]
    this.loaded = false
    this.loadStart.emit()
  }

  elementLoadProgress ( event:ProgressEvent ) {
    const p = (event.loaded / event.total) * 100
    console.log('progress: %s', p )
  }

  elementDidLoad ( event:any ) {
    //console.log ( 'image did load "%s"' , this.src )
    this.elementClass = ['loaded']
    this.loaded = true
    this.load.emit()
  }

  elementFailed ( event:any ) {
    this.elementClass = ['error']
    this.error.emit()
  }
}
