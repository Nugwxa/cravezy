import ReCAPTCHA from 'react-google-recaptcha'

interface CaptchaProviderProps {
  onTokenChange: (token: string | null) => void
}

export default function CaptchaProvider(props: Readonly<CaptchaProviderProps>) {
  const { onTokenChange } = props
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? ''

  return (
    <ReCAPTCHA
      style={{ transform: 'scale(0.85)', transformOrigin: '0 0' }}
      sitekey={siteKey}
      onChange={onTokenChange}
      onExpired={() => {
        onTokenChange(null)
      }}
    />
  )
}
