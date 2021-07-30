import * as React from 'react'

import Button from '#/components/Button'
import { ToothNumber as ToothNumberPermanent } from './ToothNumberPermanent'
import { ToothNumber as ToothNumberPrimary } from './ToothNumberPrimary'

const styles = require('./styles.scss')

interface Props {
  selected: string[]
  handleToothClick: (tooth: string) => void
}

interface State {
  permanent: boolean
  primary: boolean
}

export default class ToothNumber extends React.Component<Props, State> {
  state = {
    permanent: true,
    primary: false
  }

  componentDidMount () {
    if (this.props.selected.length) {
      let isPrimary = false
      for (let i = 0; i < this.props.selected.length; i++) {
        if (isNaN(Number(this.props.selected[i]))) {
          isPrimary = true
        }
      }
      if (isPrimary) {
        this.setState({ permanent: false, primary: true })
        return true
      } else return false
    }
  }

  showPermanent = () => {
    if (!this.state.permanent) {
      this.setState({ permanent: true, primary: false })
    }
  }

  showPrimary = () => {
    if (!this.state.primary) {
      this.setState({ permanent: false, primary: true })
    }
  }

  render () {
    return (
      <>
        <div className={styles.toothNumberButtons}>
          <Button className={styles.button} secondary={this.state.permanent} onClick={this.showPermanent}>Permanent</Button>
          <Button className={styles.button} secondary={this.state.primary} onClick={this.showPrimary}>Primary</Button>
        </div>
        <h5 className={styles.heading}>Assign Tooth Number(s)</h5>
        {
          this.state.primary
          ?
          <ToothNumberPrimary {...this.props} />
          :
          <ToothNumberPermanent {...this.props} />
        }
      </>
    )
  }
}
