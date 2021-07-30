import * as React from 'react'

import { BounceLoader } from 'react-spinners'
import cn from 'classnames'

const styles = require('./styles.scss')

interface LoaderProps {
  transparent: boolean
  size?: number
  when: boolean
  text?: string
  className?: string
}

interface Props extends LoaderProps {
  children: any
}

/*
  React typescript docs explicitly state that we should use any as typing for children.
  However this component expects a function.
  Component that conditionally shows it's children. Alleivates the need to perform ugly checks.
  ie: this.props.account ? Loader : SomeComponent
*/

const Loader = (props: LoaderProps) => {
  const loaderClassName = cn(styles.loader,{
    [styles.transparent]: props.transparent,
    [props.className]: props.className
  })
  return props.when && (
    <div className={loaderClassName}>
      <BounceLoader color={'#49A6FF'} size={props.size || 50}/>
      {props.text && <div>{props.text}</div>}
    </div>
  )
}

const OverlayLoader = (props: Props) => {
  const { children, ...loaderProps } = props
  const parent = React.Children.toArray(children)[0] as React.ReactElement<any>
  const { children: parentChildren, ...parentProps } = parent.props
  // Loader needs a key property because it's part of an array of elements
  return React.cloneElement(parent, { style: { position: 'relative' }, ...parentProps }, [...parentChildren, <Loader key={'loaderChildElement'} {...loaderProps} /> ])
}

export default OverlayLoader
