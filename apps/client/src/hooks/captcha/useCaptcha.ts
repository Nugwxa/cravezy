import { useState } from 'react'
import verifyCaptchaToken, { CaptchaToken } from '@/data/verifyCaptchaToken'

/**
 * Custom hook for managing CAPTCHA validation and state.
 *
 */
export function useCaptcha() {
  const [captchaToken, setCaptchaToken] = useState<CaptchaToken>(null)
  const [captchaError, setCaptchaError] = useState<string | null>(null)

  async function validateCaptcha() {
    const response = await verifyCaptchaToken(captchaToken)

    if (!response.success) {
      setCaptchaError(response.message)
      return false
    }

    setCaptchaError(null)
    return true
  }

  return {
    captchaToken,
    setCaptchaToken,
    captchaError,
    validateCaptcha,
  }
}
