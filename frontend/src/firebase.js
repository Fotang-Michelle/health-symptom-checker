// Firebase disabled for local development
export const app       = null
export const perf      = null
export const analytics = null
export const trace     = () => ({ start: () => {}, stop: () => {}, putAttribute: () => {}, putMetric: () => {} })
export const logEvent  = () => {}