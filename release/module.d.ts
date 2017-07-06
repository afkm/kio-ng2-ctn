import { ModuleWithProviders } from '@angular/core';
import { CtnConfig } from './interfaces/ctn-config';
import { CTN_CONFIG } from './config-provider';
import { BackendService } from './services/backend.service';
export { BackendService, CTN_CONFIG };
export declare function provideDefaultConfig<T extends string>(): CtnConfig;
export declare class KioCtnModule {
    static forRoot<T extends string>(config: CtnConfig): ModuleWithProviders;
}
