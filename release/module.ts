import { CommonModule } from '@angular/common'
import { HttpModule } from '@angular/http'
import { NgModule, ModuleWithProviders, Provider } from '@angular/core'
import { CtnConfig } from './interfaces/ctn-config'
import { CTN_CONFIG } from './config-provider'
import { BackendService } from './services/backend.service'

export { BackendService, CTN_CONFIG }

@NgModule({
  imports: [CommonModule,HttpModule],
  //declarations: [],
  providers: [ 
    {
      provide: CTN_CONFIG,
      useValue: {
        localeProvider: {
          current: 'en_US'
        }
      }
    },
    BackendService 
  ],
  //entryComponents: [],
  exports: [CommonModule,HttpModule]
})
export class KioCtnModule {

  public static forRoot (config:CtnConfig):ModuleWithProviders {
    return {
      ngModule: KioCtnModule,
      providers: [
        {
          provide: CTN_CONFIG,
          useValue: config
        },
        BackendService
      ]
    }
  }
}
