import { Component, EventEmitter, Input, Output } from '@angular/core';
var CtnImageComponent = (function () {
    function CtnImageComponent() {
        this.loadStart = new EventEmitter();
        this.load = new EventEmitter();
        this.error = new EventEmitter();
        this.elementClass = ['loading'];
        this.loaded = false;
    }
    CtnImageComponent.prototype.elementStartsToLoad = function () {
        this.elementClass = ['loading'];
        this.loaded = false;
        this.loadStart.emit();
    };
    CtnImageComponent.prototype.elementLoadProgress = function (event) {
        var p = (event.loaded / event.total) * 100;
        console.log('progress: %s', p);
    };
    CtnImageComponent.prototype.elementDidLoad = function (event) {
        //console.log ( 'image did load "%s"' , this.src )
        this.elementClass = ['loaded'];
        this.loaded = true;
        this.load.emit();
    };
    CtnImageComponent.prototype.elementFailed = function (event) {
        this.elementClass = ['error'];
        this.error.emit();
    };
    return CtnImageComponent;
}());
export { CtnImageComponent };
CtnImageComponent.decorators = [
    { type: Component, args: [{
                selector: 'ctn-image',
                templateUrl: './ctn-image.component.html',
                styleUrls: ['./ctn-image.component.css']
            },] },
];
/** @nocollapse */
CtnImageComponent.ctorParameters = function () { return []; };
CtnImageComponent.propDecorators = {
    'loadStart': [{ type: Output },],
    'load': [{ type: Output },],
    'error': [{ type: Output },],
    'src': [{ type: Input, args: ['src',] },],
};
//# sourceMappingURL=ctn-image.component.js.map