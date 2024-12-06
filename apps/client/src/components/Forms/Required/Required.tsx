'use client'
import formStyles from '@/styles/formStyles.module.scss'

export default function Required() {
  return <span className={formStyles.required}>*</span>
}
