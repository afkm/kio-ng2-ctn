import { WORKER_SOURCE } from './source'

export const worker = new Worker(window.URL.createObjectURL(new Blob([WORKER_SOURCE])))