import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant
}

export function Button({ variant, className, ...rest }: Props) {
  return <button className={`${styles[variant]} ${className ?? ''}`} {...rest} />
}
