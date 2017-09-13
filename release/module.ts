import { CommonModule } from '@angular/common'
import { HttpModule } from '@angular/http'
import { NgModule, ModuleWithProviders, Provider } from '@angular/core'
import { CtnConfig } from './interfaces/ctn-config'
import { CTN_CONFIG } from './config-provider'
import { MOCKING_PROVIDER } from './mocking-provider'
import { BackendService } from './services/backend.service'
import { CtnImageComponent } from './components/ctn-image/ctn-image.component'

export { MOCKING_PROVIDER } from './mocking-provider'

// Directives
import { DataDirective } from './directives/data.directive'
export { DataDirective } from './directives/data.directive'


export { BackendService, CTN_CONFIG }

@NgModule({
  imports: [CommonModule,HttpModule],
  declarations: [CtnImageComponent,DataDirective],
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
  exports: [CommonModule,HttpModule,CtnImageComponent]
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
