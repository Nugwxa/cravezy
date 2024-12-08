import { FormEvent } from 'react'
import { handleLoginForm } from './actions'
import { Link } from 'react-router-dom'
import Button from '@/components/Button'
import FormCallout from '@/components/Forms/FormCallout'
import formStyles from '@/styles/formStyles.module.scss'
import Required from '@/components/Forms/Required'
import useFormHandler from '@/hooks/useFormHandler'

export default function LoginPage() {
  const initialState: FormSubmissionResult = {
    success: false,
    message: 'null',
  }
  const { isLoading, submitFormData, formState } =
    useFormHandler<FormSubmissionResult>({
      initialState,
      formAction: handleLoginForm,
    })

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await submitFormData(new FormData(e.currentTarget))
  }
  return (
    <>
      <h1>Login</h1>

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

        {/* Password */}
        <div className={formStyles.inputWrapper}>
          <label htmlFor="password">
            Password <Required />
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
          />
        </div>

        <Button
          disabled={isLoading}
          type="submit"
          data-theme="pink"
          isWide
          isBold
        >
          Login
        </Button>
      </form>
      {!isLoading && <FormCallout formState={formState} />}

      <div>
        Don't have an account? <Link to={'/auth/register'}>Register</Link>
      </div>
    </>
  )
}
