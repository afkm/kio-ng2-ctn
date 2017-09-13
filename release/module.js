import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { CTN_CONFIG } from './config-provider';
import { BackendService } from './services/backend.service';
import { CtnImageComponent } from './components/ctn-image/ctn-image.component';
export { MOCKING_PROVIDER } from './mocking-provider';
// Directives
import { DataDirective } from './directives/data.directive';
export { DataDirective } from './directives/data.directive';
export { BackendService, CTN_CONFIG };
var KioCtnModule = (function () {
    function KioCtnModule() {
    }
    KioCtnModule.forRoot = function (config) {
        return {
            ngModule: KioCtnModule,
            providers: [
                {
                    provide: CTN_CONFIG,
                    useValue: config
                },
                BackendService
            ]
        };
    };
    return KioCtnModule;
}());
export { KioCtnModule };
KioCtnModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, HttpModule],
                declarations: [CtnImageComponent, DataDirective],
                providers: [
                    {
                        provide: CTN_CONFIG,
                        useValue: {
                            localeProvider: {
                                current: 'en_US'
                            }
                        }
                    },
                    BackendService,
                    DataDirective
                ],
                entryComponents: [CtnImageComponent],
                exports: [CommonModule, HttpModule, CtnImageComponent]
            },] },
];
/** @nocollapse */
KioCtnModule.ctorParameters = function () { return []; };
//# sourceMappingURL=module.js.map