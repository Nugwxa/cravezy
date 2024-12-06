import { FormEvent } from 'react'
import { handleRegistrationForm } from './actions'
import { Link } from 'react-router-dom'
import Button from '@/components/Button'
import FormCallout from '@/components/Forms/FormCallout'
import Required from '@/components/Forms/Required'
import styles from '@/styles/formStyles.module.scss'
import useFormHandler from '@/hooks/useFormHandler'

export default function RegistrationPage(): JSX.Element {
  const initialState: FormSubmissionResult = {
    success: false,
    message: 'null',
  }
  const { isLoading, submitFormData, formState } = useFormHandler({
    initialState,
    formAction: handleRegistrationForm,
  })

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await submitFormData(new FormData(e.currentTarget))
  }
  return (
    <>
      <h1>Register</h1>

      <form onSubmit={handleFormSubmit} className={styles.form}>
        {/* Name */}
        <div className={styles.inputWrapper}>
          <label htmlFor="name">
            Name <Required />
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            minLength={2}
            maxLength={100}
            required
          />
        </div>

        {/* Email */}
        <div className={styles.inputWrapper}>
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
        <div className={styles.inputWrapper}>
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

        {/* Confirm Password */}
        <div className={styles.inputWrapper}>
          <label htmlFor="confirm-password">
            Confirm Password <Required />
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            minLength={6}
          />
        </div>

        {/* Verification Code */}
        <div className={styles.inputWrapper}>
          <label htmlFor="verification-code">
            Verification Code <Required />
          </label>
          <input
            id="verificationToken"
            name="verificationToken"
            type="text"
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
          Register
        </Button>
      </form>
      {!isLoading && <FormCallout formState={formState} />}

      <div>
        Already have an account? <Link to={'/auth/login'}>Login</Link>
      </div>
    </>
  )
}
