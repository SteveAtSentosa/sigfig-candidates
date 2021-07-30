import * as React from 'react'

import { Link } from 'react-router-dom'
import Loader from './Loader'
import cn from 'classnames'

const styles = require('./styles.scss')

interface Props {
  className?: string
  size?: number
  when: boolean
  children: any
  color?: string
}

interface State {
  showRefreshButton: boolean
}

/*
  React typescript docs explicitly state that we should use any as typing for children.
  However this component expects a function.
  Component that conditionally shows it's children. Alleivates the need to perform ugly checks.
  ie: this.props.account ? Loader : SomeComponent
*/

let timeout = null

class LoaderWithTimeout extends React.PureComponent<Pick<Props, 'className' | 'size' | 'color'>, State> {
  state: State = {
    showRefreshButton: false
  }

  private classNames = cn({
    [this.props.className]: this.props.className
  })

  componentDidMount () {
    timeout = setTimeout(() => {
      this.setState({ showRefreshButton: true })
    }, 5000)
  }

  componentWillUnmount () {
    if (timeout) {
      clearTimeout(timeout)
    }
  }

  private renderText = () => (
    this.state.showRefreshButton
    ? <span>If this page does not redirect you in 10 seconds, <Link to='/logout'>click here to log back in</Link>.</span>
    : <span>Loading</span>
  )

  render () {
    return (
      <div className={styles.preloader}>
        <div className={this.classNames}>
          <Loader size={this.props.size || 30} timeout={0}/>
        </div>
        <div className={styles.loadingText}>{this.renderText()}</div>
      </div>
    )
  }
}

export default class Loads extends React.PureComponent<Props> {

  render () {
    const { className, size, color } = this.props
    return (
      !this.props.when
      ? (
        <LoaderWithTimeout className={className} size={size} color={color} />
      )
      : <> {this.props.children()} </>
    )
  }

}
