import { useState } from 'react'

interface UseFormHandlerProps<T> {
  formAction: (formData: FormData) => Promise<T>
  initialState: T
}

/**
 * A custom hook for managing form submission with FormData
 *
 * @template T - The type of the response data from the `formAction` function
 * @param formAction - The async function that handles the form submission logic
 * @param initialState - The initial state of the form's response
 */
export default function useFormHandler<T = unknown>(
  props: Readonly<UseFormHandlerProps<T>>
) {
  const { initialState, formAction } = props
  const [formState, setFormState] = useState<T>(initialState)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  /**
   * Submits the provided form data using the `formAction` function
   *
   * Prevents multiple simultaneous submissions by checking the `isLoading` state
   *
   * @param formData - The FormData object to be submitted
   * @returns A promise that resolves when the submission is complete
   */
  async function submitFormData(formData: FormData): Promise<void> {
    if (isLoading) return
    setIsLoading(true)
    try {
      const response = await formAction(formData)
      setFormState(response)
    } finally {
      setIsLoading(false)
    }
  }

  return { formState, submitFormData, isLoading }
}
