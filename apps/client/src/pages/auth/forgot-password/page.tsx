import { FormEvent } from 'react'
import { handleForgotPasswordForm } from './actions'
import { Link } from 'react-router-dom'
import Button from '@/components/Button'
import FormCallout from '@/components/Forms/FormCallout'
import formStyles from '@/styles/formStyles.module.scss'
import Required from '@/components/Forms/Required'
import useFormHandler from '@/hooks/useFormHandler'

export default function ForgotPasswordPage() {
  const initialState: FormSubmissionResult = {
    success: false,
    message: 'null',
  }
  const { formState, submitFormData, isLoading } = useFormHandler({
    formAction: handleForgotPasswordForm,
    initialState,
  })

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await submitFormData(new FormData(e.currentTarget))
  }
  return (
    <>
      <h1>Forgot Password</h1>

      <form onSubmit={handleFormSubmit} className={formStyles.form}>
        {/* Email */}
        <div className={formStyles.inputWrapper}>
          <label htmlFor="email">
            Email <Required />
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>

        <Button
          disabled={isLoading}
          type="submit"
          data-theme="pink"
          isWide
          isBold
        >
          Request Password Reset
        </Button>
      </form>
      {!isLoading && <FormCallout formState={formState} />}

      <div>
        Don't have an account? <Link to={'/auth/register'}>Register</Link>
      </div>
    </>
  )
}
