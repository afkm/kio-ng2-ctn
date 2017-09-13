import { Inject, Input, Directive, Output, EventEmitter } from '@angular/core';
import { BackendService } from '../services/backend.service';
var DataDirective = (function () {
    function DataDirective(backend) {
        this.backend = backend;
        //@Input('node') nodeData:KioContentModel|KioPublicationModel
        this.nodeContentData = new EventEmitter();
        /*setTimeout(()=>{
          const directives = (<any>window).dataDirectives = (<any>window).dataDirectives || {}
          directives[this.logger.id] = this
        },100)*/
    }
    DataDirective.prototype.ngOnInit = function () {
        /*this.logger.log('OnInit')*/
    };
    DataDirective.prototype.ngOnDestroy = function () {
        /*this.logger.log('OnDestroy')*/
    };
    DataDirective.prototype.ngOnChanges = function (changes) {
        /*this.logger.log('changes', changes)*/
    };
    DataDirective.prototype.ngAfterContentInit = function () {
        /*this.logger.log('after content init')*/
    };
    DataDirective.prototype.ngAfterViewInit = function () {
        /*this.logger.log('after view init')*/
    };
    return DataDirective;
}());
export { DataDirective };
/*protected logger=window.afkm.logger.cloneToScope(this,{
  labelStyle: {
    fontSize: '16px',
    fontWeight: 'bold'
  }
})*/
DataDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ctn]'
            },] },
];
/** @nocollapse */
DataDirective.ctorParameters = function () { return [
    { type: BackendService, decorators: [{ type: Inject, args: [BackendService,] },] },
]; };
DataDirective.propDecorators = {
    'contentNode': [{ type: Input, args: ['ctn',] },],
    'nodeContentData': [{ type: Output, args: ['contentData',] },],
};
//# sourceMappingURL=data.directive.js.map