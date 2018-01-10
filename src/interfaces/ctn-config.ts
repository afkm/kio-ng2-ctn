import { LocaleProvider } from './locale-provider'

export type Optional<T> = {
  [K in keyof T]: T[K]
}

export interface CtnApiConfig {
  post_url: string
  get_url: string
  timeout: number
  cache_ttl: number
  concurrencyLimit?: number
}

export interface CtnConfig {
  localeProvider: LocaleProvider
  api?: Optional<CtnApiConfig>

  /**
   * use inline web worker for xhr requests
   */
  useWebWorker?: boolean
}