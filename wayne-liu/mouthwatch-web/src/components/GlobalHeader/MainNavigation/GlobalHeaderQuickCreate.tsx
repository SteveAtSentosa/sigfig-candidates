import * as React from 'react'

import { QuickCreateAppointment, QuickCreateCapture, QuickCreatePatient, QuickCreateTask } from '#/components/QuickCreate'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import PopperWorkspace from '#/components/PopperWorkspace'
import { faPlus } from '@fortawesome/pro-light-svg-icons'
import { ViewPermissions } from '#/types'
import { hasPermission } from '#/utils'
import { ProBadge } from '#/components/Badge'

const styles = require('./styles.scss')

interface Props {
  accountId: string
  viewPerms: ViewPermissions
}

interface State {
  popperOpen: boolean
}

export default class GlobalHeaderQuickCreate extends React.PureComponent<Props, State> {
  state: State = {
    popperOpen: false
  }

  quickActionRef = React.createRef<HTMLButtonElement>()
  popperListRef = React.createRef<typeof PopperWorkspace>()
  popperTaskRef = React.createRef<typeof PopperWorkspace>()
  popperAppointmentRef = React.createRef<typeof PopperWorkspace>()
  popperPatientRef = React.createRef<typeof PopperWorkspace>()
  popperCaptureRef = React.createRef<typeof PopperWorkspace>()
  openPopperActive = null

  hidePopper = () => {
    if (this.openPopperActive) {
      this.openPopperActive.current.hide()
      this.openPopperActive = null
    }
    /*
      HACK:
      The PopperWorkspace component returns an anonymous class that extends the HOC
      returned by connect().
      This results in at least 10 re-renders whenever we hide/show it -- which ultimately means
      that sometimes it will quickly hide, then show.
      This setTimeout does not prevent the re-renders, but it allows us to consistently show/hide
      the Popper properly.
      We may consider using react-bootstrap OverlayTrigger / Popover components
    */
    setTimeout(() => {
      this.setState({ popperOpen: false })
    }, 300)
  }

  openPopper = (ref) => {
    if (this.openPopperActive) {
      this.openPopperActive.current.hide()
    }
    this.openPopperActive = ref

    this.setState({ popperOpen: true }, () => {
      ref.current.show()

    })
  }

  private get isMobileWidth () {
    return window.innerWidth <= 576
  }

  private handleButtonClick = (popperListRef) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (this.state.popperOpen) {
      this.hidePopper()
    } else {
      this.openPopper(popperListRef)
    }
  }

  private renderCreateButton = () => (
    <button className={styles.navItem} title={'Create'} ref={this.quickActionRef}>
      <Link to='#' onClick={this.handleButtonClick(this.popperListRef)}>
        <div className={styles.icon}><FontAwesomeIcon icon={faPlus} /></div>
        <span className={styles.text}>Create</span>
      </Link>
    </button>
  )

  private renderPopperList = () => {
    const { viewPerms } = this.props

    return (
      <PopperWorkspace
        placement='top'
        title='List'
        flexWidth
        offset={this.isMobileWidth && '0'}
        targetRef={this.quickActionRef}
        ref={this.popperListRef}
        clickOffCb={this.hidePopper}
        clickOffTargetExceptionFn={(e) => {
          const safeStyles = [styles.navItem]
          return safeStyles.includes(e.target.className)
        }}
      >
        <div className={styles.quick_add_options}>
          <ul>
            <li onClick={() => this.openPopper(this.popperPatientRef)}>Patient</li>
            {hasPermission(viewPerms, 'capture')
              ? <li onClick={() => this.openPopper(this.popperCaptureRef)}>Capture</li>
              : <li className={styles.disabled}>Capture <ProBadge /></li>}
            <li onClick={() => this.openPopper(this.popperAppointmentRef)}>Appointment</li>
            {hasPermission(viewPerms, 'tasks')
              ? <li onClick={() => this.openPopper(this.popperTaskRef)}>Task</li>
              : <li className={styles.disabled}>Task <ProBadge /></li>}
          </ul>
        </div>
      </PopperWorkspace>
    )
  }

  private renderPopperForms = () => (
    <>
      <PopperWorkspace
        placement='top'
        title='Task'
        flexWidth
        offset={!this.isMobileWidth && '-50vw'}
        targetRef={this.quickActionRef}
        ref={this.popperTaskRef}
        clickOffCb={this.hidePopper}
        clickOffTargetExceptionFn={(e) => {
          const safeStyles = [styles.navItem]
          return safeStyles.includes(e.target.className)
        }}
      >
        <QuickCreateTask onFinishCreate={this.hidePopper} />
      </PopperWorkspace>
      <PopperWorkspace
        placement='top'
        title='Appointment'
        flexWidth
        offset={!this.isMobileWidth && '-50vw'}
        targetRef={this.quickActionRef}
        ref={this.popperAppointmentRef}
        clickOffCb={this.hidePopper}
        clickOffTargetExceptionFn={(e) => {
          const safeStyles = [styles.navItem]
          return safeStyles.includes(e.target.className)
        }}
      >
        <QuickCreateAppointment onFinishCreate={this.hidePopper} />
      </PopperWorkspace>
      <PopperWorkspace
        placement='top'
        title='Patient'
        flexWidth
        offset={!this.isMobileWidth && '-50vw'}
        targetRef={this.quickActionRef}
        ref={this.popperPatientRef}
        clickOffCb={this.hidePopper}
        clickOffTargetExceptionFn={(e) => {
          const safeStyles = [styles.navItem]
          return safeStyles.includes(e.target.className)
        }}
      >
        <QuickCreatePatient onFinishCreate={this.hidePopper} />
      </PopperWorkspace>
      <PopperWorkspace
        placement='top'
        title='Capture'
        flexWidth
        offset={!this.isMobileWidth && '-50vw'}
        targetRef={this.quickActionRef}
        ref={this.popperCaptureRef}
        clickOffCb={this.hidePopper}
        clickOffTargetExceptionFn={(e) => {
          const safeStyles = [styles.navItem]
          return safeStyles.includes(e.target.className)
        }}
      >
        <QuickCreateCapture providerId={this.props.accountId} />
      </PopperWorkspace>
    </>
  )

  render () {
    return (
      <>
        {this.renderCreateButton()}
        {this.renderPopperList()}
        {this.renderPopperForms()}
      </>
    )
  }
}
