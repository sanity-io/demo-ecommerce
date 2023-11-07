import type {ENVIRONMENT} from './constants'

export declare global {
  interface Window {
    [ENVIRONMENT]: {
      preview: {
        domain?: string
        secret: string
      }
      shopify: {
        storeDomain: string
      }
    }
  }
}
