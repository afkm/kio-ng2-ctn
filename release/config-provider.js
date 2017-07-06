import { InjectionToken } from '@angular/core';
export var CTN_CONFIG = new InjectionToken('ctn_config');
export var DefaultConfigProvider = {
    provide: CTN_CONFIG,
    useValue: {
        localeProvider: {
            current: 'en_US'
        }
    }
};
//# sourceMappingURL=config-provider.js.map