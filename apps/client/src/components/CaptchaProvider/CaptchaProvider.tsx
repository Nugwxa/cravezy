import ReCAPTCHA from 'react-google-recaptcha'

interface CaptchaProviderProps {
  onTokenChange: (token: string | null) => void
}

export default function CaptchaProvider(props: Readonly<CaptchaProviderProps>) {
  const { onTokenChange } = props
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? ''

  return (
    <ReCAPTCHA
      sitekey={siteKey}
      onChange={onTokenChange}
      onExpired={() => {
        onTokenChange(null)
      }}
    />
  )
}
