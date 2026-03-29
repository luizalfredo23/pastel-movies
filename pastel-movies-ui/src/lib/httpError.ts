import axios from 'axios'
import type { ApiErrorBody } from '../types'

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorBody | undefined
    if (data?.message) {
      if (data.errors && Object.keys(data.errors).length > 0) {
        const parts = Object.entries(data.errors).map(([k, v]) => `${k}: ${v}`)
        return `${data.message} — ${parts.join('; ')}`
      }
      return data.message
    }
    return err.message || 'Request failed'
  }
  if (err instanceof Error) return err.message
  return 'Something went wrong'
}
