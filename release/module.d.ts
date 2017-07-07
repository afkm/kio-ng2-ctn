import { ModuleWithProviders } from '@angular/core';
import { CtnConfig } from './interfaces/ctn-config';
import { CTN_CONFIG } from './config-provider';
import { BackendService } from './services/backend.service';
export { BackendService, CTN_CONFIG };
export declare class KioCtnModule {
    static forRoot(config: CtnConfig): ModuleWithProviders;
}
