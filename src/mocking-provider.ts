import { InjectionToken, Provider } from '@angular/core'
import { MockingProvider } from './interfaces/mocking-provider'

export let MOCKING_PROVIDER = new InjectionToken<MockingProvider>('mocking_provider')