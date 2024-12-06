import { FormEvent, useState } from 'react'
import { useCaptcha } from '@/hooks/captcha/useCaptcha'
import CaptchaProvider from '@/components/Forms/CaptchaProvider'

export default function TestPage() {
  const { captchaToken, setCaptchaToken, captchaError, validateCaptcha } =
    useCaptcha()
  const [formState, setFormState] =
    useState<FormSubmissionResult<string> | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const isCaptchaValid = await validateCaptcha()
    if (!isCaptchaValid) {
      setFormState({
        success: false,
        message: captchaError || 'Captcha validation failed',
      })
      return
    }

    setFormState({ success: true, message: 'Form submitted ' })
  }

  return (
    <div>
      <h1>Test Page</h1>
      {formState?.message && <p>{formState.message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button disabled={!captchaToken}>Submit</button>
        <CaptchaProvider onTokenChange={setCaptchaToken} />
      </form>
    </div>
  )
}
