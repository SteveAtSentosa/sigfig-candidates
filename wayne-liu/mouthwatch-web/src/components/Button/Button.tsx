import * as React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { capitalize } from 'lodash'
import cn from 'classnames'
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons'

const styles = require('./styles.scss')

type ButtonTypeProps = 'button' | 'reset' | 'submit'
interface Props {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: (e: any) => void
  secondary?: boolean
  noOutline?: boolean
  forToolbar?: boolean
  submit?: boolean
  form?: string
  type?: ButtonTypeProps
  style?: { [attr: string]: string }
  inline?: boolean
  transparent?: boolean
  skinnyBtn?: boolean
}

const Button: React.FunctionComponent<Props> = (props) => {
  const { disabled, secondary, noOutline, forToolbar, className, transparent, inline, skinnyBtn } = props
  const classNames = cn(styles.button, {
    [styles.disabled]: disabled,
    [styles.secondary]: secondary,
    [styles.primary]: !secondary,
    [styles.noOutline]: noOutline,
    [styles.forToolbar]: forToolbar,
    [styles.inline]: inline,
    [styles.transparent]: transparent,
    [styles.skinnyBtn]: skinnyBtn,
    [className]: className
  })
  const buttonTypeProps: { type?: ButtonTypeProps } = (props.submit)
    ? { type: 'submit' }
    : {}
  const buttonFormProps = (props.form)
    ? { form: props.form }
    : {}

  return (
    <span className={classNames} style={{ ...props.style }}>
      <button
        disabled={props.disabled}
        onClick={props.onClick}
        {...buttonTypeProps}
        {...buttonFormProps}
      >
        {props.children}
      </button>
    </span>
  )
}

export default Button

interface SocialProps {
  type: 'facebook' | 'google'
  onClick?: () => void
}

export const SocialButton: React.FunctionComponent<SocialProps> = ({ type, onClick }) => {
  const isFacebook = type === 'facebook'
  return (
    <Button className={styles.btn} inline secondary={!isFacebook} onClick={onClick}>
      {
        isFacebook ?
        <span className={styles.facebookLogo}><FontAwesomeIcon icon={faFacebookSquare} /></span> :
        <span className={styles.googleLogo} />
      }
      <span className={styles.btnText}>
        {`Login with ${capitalize(type)}`}
      </span>
    </Button>
  )
}
