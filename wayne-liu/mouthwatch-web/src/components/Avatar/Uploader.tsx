import * as React from 'react'

import { Account, Patient } from '#/types'
import { AvatarOptions, Default } from '#/components/Avatar'
import { Manager, Reference } from 'react-popper'

import { AddAvatar } from '#/actions/avatars'
import { AppState } from '#/redux'
import { Avatar } from '#/reducers/avatars'
import { DataURLToFile } from '#/utils'
import { DisplayFileInputImage } from '#/components/Avatar/FileInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PopperWorkspace from '#/components/PopperWorkspace'
import { SaveAccountAvatar } from '#/actions/accounts'
import config from '#/config'
import { connect } from 'react-redux'
import { faEdit } from '@fortawesome/pro-regular-svg-icons'

const styles = require('./styles.scss')

interface OwnProps {
  editPhoto: boolean
  patient?: Patient
  account?: Account
}

interface StateProps {
  avatars: Avatar[]
}

interface ActionProps {
  addAvatar: typeof AddAvatar
  saveAvatar: typeof SaveAccountAvatar
}

interface State {
  menuOpen: boolean
}

type Props = OwnProps & StateProps & ActionProps

class AvatarUploader extends React.PureComponent<Props> {
  state: State = {
    menuOpen: false
  }

  editImageButtonRef = React.createRef<HTMLDivElement>()
  editImageMenuRef = React.createRef<typeof PopperWorkspace>()

  private openEditImageMenu = () => {
    this.editImageMenuRef.current.show()
    this.setState({ menuOpen: true })
  }

  private closeEditImageMenu = () => {
    this.editImageMenuRef.current.hide()
    this.setState({ menuOpen: false })
  }

  private get firstName () {
    return (this.props.account && this.props.account.first_name) || (this.props.patient && this.props.patient.first_name)
  }

  private get lastName () {
    return (this.props.account && this.props.account.last_name) || (this.props.patient && this.props.patient.last_name)
  }

  private get type () {
    const { patient } = this.props
    return patient ? 'patient' : 'account'
  }

  private get id () {
    return (this.props.account && this.props.account.id) || (this.props.patient && this.props.patient.id)
  }

  private get avatar () {
    return this.props.avatars.find(avatar => avatar.id === this.id)
  }

  private constructLambdaURL = (id: string, type: 'provider' | 'patient') => {
    const endpoint = type === 'patient' ? `/patients/${id}/avatar` : `/accounts/${id}/avatar`
    return config.api.lambdaUrl + endpoint
  }

  private addAvatar = () => {
    const chatType = this.type === 'patient' ? 'patient' : 'provider'
    const lambdaUrl = this.constructLambdaURL(this.id, chatType)
    this.props.addAvatar({ id: this.id , lambdaUrl })
  }

  private handleFile = (data: any) => {
    this.props.saveAvatar({ file: DataURLToFile(data), association_id: this.id, type: this.type })
    this.closeEditImageMenu()
  }

  private handleWebcam = (data: any) => {
    this.props.saveAvatar({ file: DataURLToFile(data), association_id: this.id, type: this.type })
    this.closeEditImageMenu()
  }

  private handleDefault = () => {
    this.closeEditImageMenu()
  }

  componentDidMount () {
    if (!this.avatar) {
      this.addAvatar()
    }
  }

  render () {
    const { editPhoto } = this.props
    const { menuOpen } = this.state
    return (
      <Manager>
        <div className={styles.avatarUploader}>

          <DisplayFileInputImage className={styles.thumbnail} src={this.avatar ? this.avatar.lambdaUrl : '/static/images/transparent.png'} />
          <Default firstName={this.firstName} lastName={this.lastName} additionalClassName={styles.defaultAvatar} />

          {
            editPhoto &&
            <div className={menuOpen ? styles.editLinkOpen : styles.editLink}>
              <Reference>
                {() => (
                  <div className={styles.editIcon} onClick={this.openEditImageMenu} ref={this.editImageButtonRef}>
                    <FontAwesomeIcon icon={faEdit} />
                  </div>
                )}
              </Reference>
              <PopperWorkspace
                flexWidth
                offset='-5vw,2vw'
                targetRef={this.editImageButtonRef}
                ref={this.editImageMenuRef}
                clickOffCb={this.closeEditImageMenu}
              >
                <AvatarOptions onDefault={this.handleDefault} onFile={this.handleFile} onWebcam={this.handleWebcam} />
              </PopperWorkspace>
            </div>
          }
        </div>
      </Manager>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState) => ({
    avatars: state.avatars.byId
  }),
  {
    addAvatar: AddAvatar,
    saveAvatar: SaveAccountAvatar
  }
)(AvatarUploader)
