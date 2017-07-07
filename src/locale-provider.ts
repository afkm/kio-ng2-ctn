import { InjectionToken, Provider } from '@angular/core'
import { LocaleProvider } from './interfaces/locale-provider'

export let LOCALE_PROVIDER = new InjectionToken<LocaleProvider>('locale_provider')

export let DefaultLocaleProvider:Provider = {
  provide: LOCALE_PROVIDER,
  useValue: {
    current: 'en_US'
  }
}