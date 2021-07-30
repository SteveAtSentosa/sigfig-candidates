import BSModal, { ModalProps as BSModalProps } from 'react-bootstrap/Modal'

import { ModalHeaderProps as BMHeaderProps } from 'react-bootstrap/ModalHeader'
import React from 'react'
import cn from 'classnames'

const styles = require('./styles.scss')

type ModalSize = 'sm' | 'md' | 'lg'

export interface BodyProps {
  children?: React.ReactNode
  className?: string
}

export interface BaseModalProps {
  backdrop?: 'static' | true | false
  isOpen: boolean
  keyboard?: boolean
  show?: boolean
  size?: ModalSize
  close?: () => void
  onHide?: () => void
  onEntered?: () => void
}

export const keysOfBaseModalProps = ['backdrop', 'isOpen', 'keyboard', 'show', 'size', 'close', 'onHide', 'onEntered']

/**
 * Modal wrapper
 */

export interface ModalProps extends Omit<BSModalProps, 'size'> {
  close?: () => void
  size?: ModalSize
  isOpen?: boolean
}

export function Wrapper ({ size, className, isOpen, close, backdrop, keyboard, onEntered, ...props }: ModalProps) {
  return (
    <BSModal
      animation={false}
      backdropClassName={styles.backdrop}
      centered
      dialogClassName={cn(styles.dialog, className, size ? styles[size] : styles.lg)}
      show={isOpen}
      onHide={close}
      backdrop={backdrop}
      keyboard={keyboard}
      onEntered={onEntered}
      {...props}
    />
  )
}

Wrapper.defaultProps = {
  backdrop: 'static',
  keyboard: false
}

/**
 * Header
 */

export interface HeaderProps extends BMHeaderProps {
  children: React.ReactNode
}

export function Header ({ ref, ...props }: HeaderProps) {
  return (
    <BSModal.Header className={styles.header} {...props} />
  )
}

/**
 * Header button
 */

interface HeaderButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  className?: string
  innerRef?: any
}

export function HeaderButton (props: HeaderButtonProps) {
  return (
    <div ref={props.innerRef} className={`${styles.headerButton} ${props.className}`} onClick={props.onClick}>
      {props.children}
    </div>
  )
}

/**
 * Footer
 */

export interface FooterProps {
  children?: React.ReactNode
  className?: string
}

export function Footer ({ className, ...props }: FooterProps) {
  return (
    <BSModal.Footer className={cn(styles.footer, className)} {...props}/>
  )
}

/**
 * Body
 */

export function Body ({ className, ...props }: BodyProps) {
  return (
    <BSModal.Body className={cn(styles.body, className)} {...props}/>
  )
}
