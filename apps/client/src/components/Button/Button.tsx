'use client'

import classNames from 'classnames'
import styles from './Button.module.scss'

// Type for the `as` prop, allowing any valid React element type.
type AsProp<T extends React.ElementType> = {
  as?: T
}

// The different button states/styles
export type ButtonMode = 'solid' | 'stroke' | 'transparent'

// Main button props type, combining the `as` prop and omitting the original `as` if it exists.
type ButtonProps<T extends React.ElementType = 'button'> = AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, 'as'> & {
    children?: React.ReactNode
    className?: string
    icon?: React.ReactNode
    isBold?: boolean
    isWide?: boolean
    mode?: ButtonMode
  }

/**
 * A customizable button component that supports icons and has a wide range of default styling options.
 * This can be used as a button or Link
 *
 * @param {T} as -  The component or element type to render. (optional)
 * @param {React.ReactNode} children - The text to display inside the button. (optional)
 * @param {string} className - Additional class names to apply to the button for additional styling. (optional)
 * @param {React.ReactNode} icon - Icon to display inside the button. (optional)
 * @param {boolean} isBold - Whether the button text should be bold. (optional)
 * @param {boolean} isWide - Whether the button's width should fill the container. (optional)
 * @param {'solid' | 'stroke' |'border'} mode - The style mode of the button; can be 'solid', "transparent" or 'stroke'.
 *
 *
 * @example
 * // Renders a button.
 * <Button>I am a button</Button>
 *
 * @example
 * // Renders a button with a different style.
 * <Button mode="stroke">I am a different button</Button>
 *
 * @example
 * // Renders a link (<a>).
 * <Button as={Link} href="/">I am a link</Button>
 */
export default function Button<T extends React.ElementType = 'button'>(
  props: Readonly<ButtonProps<T>>
): JSX.Element {
  const {
    as: Component = 'button', // Default to 'button' if no `as` prop is provided
    children,
    className,
    icon,
    isBold = false,
    isWide = false,
    mode = 'solid',
    ...rest
  } = props

  // Ensure TypeScript recognizes `Component` as a valid JSX element type
  const Element = Component as React.ElementType
  return (
    <Element
      className={classNames(className, styles.button, {
        [styles.isWide]: isWide,
        [styles.strokeButton]: mode === 'stroke',
        [styles.transparentButton]: mode === 'transparent',
        [styles.isBold]: isBold,
      })}
      {...rest}
    >
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
      {children}
    </Element>
  )
}
