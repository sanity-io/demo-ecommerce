import type {z} from 'zod'

import type {ENVIRONMENT, environmentSchema} from './constants'

export declare global {
  interface Window {
    [ENVIRONMENT]: z.infer<typeof environmentSchema>
  }
}
