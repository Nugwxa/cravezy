'use client'
import { ReactNode } from 'react'
import classNames from 'classnames'
import React from 'react'
import style from './Callout.module.scss'

interface CalloutProps extends React.ComponentPropsWithoutRef<'div'> {
  children: ReactNode
  className?: string
  icon: JSX.Element
  isWide?: boolean
  title?: string
}

/**
 * Renders a styled callout box.
 *
 * @param {string} className - Additional class name to apply to the callout.
 * @param {string} title - Title text to display at the top of the callout. (Optional)
 * @param {string} children - Text content to display within the callout.
 * @param {JSX.Element} icon - Icon to display in the callout.
 * @param {boolean} isWide - Flag to apply wide styling to the callout. (Optional)
 */
export default function Callout(props: Readonly<CalloutProps>) {
  const { children, className, icon, isWide = false, title, ...rest } = props
  return (
    <div
      className={classNames(className, style.callout, {
        [style.isWide]: isWide,
      })}
      {...rest}
    >
      <div className={style.calloutContainer}>
        <div className={style.iconWrapper}>{icon}</div>
        <div className={style.calloutTextSection}>
          <div className={style.calloutTitle}>{title}</div>
          <div className={style.calloutText}>{children}</div>
        </div>
      </div>
    </div>
  )
}
