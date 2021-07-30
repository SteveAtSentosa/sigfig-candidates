import * as React from 'react'

import { BounceLoader, GridLoader } from 'react-spinners'

const styles = require('./styles.scss')

interface DefaultProps {
  className: string
  size: number
  type: 'grid' | 'bounce'
  timeout: number
  color: string
}

type Props = Partial<DefaultProps>

interface State {
  shouldShowLoader: boolean
}
class Loader extends React.PureComponent<Props, State> {
  static defaultProps: DefaultProps = {
    className: '',
    size: 30,
    type: 'bounce',
    timeout: 1000,
    color: '#49A6FF'
  }

  state: State = {
    shouldShowLoader: false
  }

  timeout: NodeJS.Timeout = null

  componentDidMount () {
    this.timeout = setTimeout(() => this.setState({ shouldShowLoader: true }), this.props.timeout)
  }

  componentWillUnmount () {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
    }
  }

  private renderLoader = () => {
    const { className, size, type, color } = this.props
    return (
    <div className={`${styles.loading} ${className}`}>
      {type === 'grid' ? <GridLoader size={size} color={color}/> : <BounceLoader size={size || 30} color={color}/>}
    </div>)
  }

  render () {
    return this.state.shouldShowLoader && this.renderLoader()
  }
}

export default Loader
