import { CommonModule } from '@angular/common'
import { HttpModule } from '@angular/http'
import { NgModule, ModuleWithProviders, Provider } from '@angular/core'
import { CtnConfig } from './interfaces/ctn-config'
import { CTN_CONFIG, DefaultConfigProvider } from './config-provider'
import { BackendService } from './services/backend.service'

export { BackendService, CTN_CONFIG }

export function provideDefaultConfig<T extends string> ():CtnConfig {
  return {
    localeProvider: {
      current: 'en_US'
    }
  }
}

@NgModule({
  imports: [CommonModule,HttpModule],
  //declarations: [],
  providers: [ {
    provide: CTN_CONFIG,
    useFactory: provideDefaultConfig
  }, BackendService ],
  //entryComponents: [],
  exports: [CommonModule,HttpModule]
})
export class KioCtnModule {

  public static forRoot<T extends string> (config:CtnConfig):ModuleWithProviders {
    return {
      ngModule: KioCtnModule,
      providers: [
        {
          provide: CTN_CONFIG,
          useValue: config
        }
      ]
    }
  }
}
