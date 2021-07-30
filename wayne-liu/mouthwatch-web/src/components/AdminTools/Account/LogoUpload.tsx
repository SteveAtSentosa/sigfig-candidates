import * as React from 'react'

import EssentialTooltip from '#/components/EssentialTooltip'
import { Field as ReduxFormField } from 'redux-form'

const styles = require('./styles.scss')

type Props = {
  uploadLogoText: string
  onFileChosen: (e) => void
  showUpgradeTooltip?: boolean
}

type State = {
  chosenFile: null | string
}

export const LogoPreview = ({ src, forTable = false }) => {
  return (
    <div className={forTable ? styles.tableLogo : styles.logo}>
      <img src={src} />
    </div>
  )
}

const UploadLogoLink = ({ openFileInput, uploadLogoText, fileInputRef, onFileChange }) => {
  return (
    <>
      <a className={styles.logoUploadLink} onClick={openFileInput}>{uploadLogoText}</a>
      <input name='picture' type='file' ref={fileInputRef} onChange={onFileChange} hidden accept='.png, .jpeg, .jpg'/>
    </>
  )
}

const PictureViewer = (field) => {
  const value = field.input.value
  return value && <LogoPreview src={typeof value === 'string' ? value : URL.createObjectURL(value)} />
}

export default class LogoUpload extends React.PureComponent<Props, State> {
  state: State = {
    chosenFile: null
  }

  fileInputRef = React.createRef<HTMLInputElement>()

  openFileInput = () => {
    this.fileInputRef.current.click()
  }

  fileChosen = (e) => {
    const fileList: FileList = e.target.files
    const firstFile = fileList[0]
    const reader = new FileReader()
    reader.onload = (e: any) => {
      this.setState({ chosenFile: e.target.result })
    }
    reader.readAsDataURL(firstFile)
    this.props.onFileChosen(firstFile)
  }

  _renderPreview = () => {
    return (
      <div>
        <img src={this.state.chosenFile} />
      </div>
    )
  }

  private renderUploadLink = () => {
    const { uploadLogoText } = this.props
    return (
      <UploadLogoLink
        fileInputRef={this.fileInputRef}
        openFileInput={this.openFileInput}
        uploadLogoText={uploadLogoText}
        onFileChange={this.fileChosen}
      />
    )
  }

  render () {
    const { showUpgradeTooltip } = this.props
    return (
      <div className={styles.logoUpload}>
        {
          this.state.chosenFile ?
          this._renderPreview()
          :
          <ReduxFormField
            name='picture'
            component={PictureViewer}
          />
        }
        {
          !showUpgradeTooltip ?
          this.renderUploadLink() :
          <EssentialTooltip
            content={<span>Further customize TeleDent with your <strong>logo</strong> when you upgrade to TeleDent Professional.</span>}
          >
            { this.renderUploadLink() }
          </EssentialTooltip>
        }
      </div>
    )
  }
}
