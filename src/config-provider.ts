import { InjectionToken, Provider } from '@angular/core'
import { LocaleProvider } from './interfaces/locale-provider'
import { CtnConfig } from './interfaces/ctn-config'

export let CTN_CONFIG = new InjectionToken<CtnConfig>('ctn_config')

export let DefaultConfigProvider:Provider = {
  provide: CTN_CONFIG,
  useValue: {
    localeProvider: {
      current: 'en_US'
    }
  }
}