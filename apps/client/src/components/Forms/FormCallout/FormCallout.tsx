import Callout from '@/components/Callout'
import { AlertTriangleIcon, CheckCircle2Icon } from 'lucide-react'

interface FormCalloutProps {
  formState: FormSubmissionResult
}

/**
 * A component that renders a callout based on the result of a form submission.
 *
 * @param {FormSubmissionResult} formState - The formState object.
 */
export default function FormCallout(props: Readonly<FormCalloutProps>) {
  const { formState } = props

  if (formState.message === 'null') return null

  // Set the callout's icon
  const calloutIcon: JSX.Element = formState.success ? (
    <CheckCircle2Icon size={16} />
  ) : (
    <AlertTriangleIcon size={16} />
  )

  // Set the callout's theme
  const calloutTheme = formState.success ? 'green' : 'red'
  return (
    <Callout
      data-theme={calloutTheme}
      // Set the title if there are multiple errors
      title={formState.errors ? formState.message : undefined}
      icon={calloutIcon}
      isWide
    >
      {/* Display the error messages if any, or the general error message */}
      {formState.errors
        ? formState.errors.map((error) => `• ${error} `)
        : formState.message}
    </Callout>
  )
}
