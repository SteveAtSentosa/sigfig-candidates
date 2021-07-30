import * as React from 'react'
import { Field as ReduxFormField } from 'redux-form'

const styles = require('./styles.scss')

type Props = {
  onFileChosen: (value) => void
}

type State = {
  chosenFile: null | File
}

const AvatarPreview = ({ src }) => {
  return (
    <img className={styles.avatar} src={src} />
  )
}

const UploadAvatarLink = ({ openFileInput, uploadAvatarText, fileInputRef, onFileChange }) => {
  return (
    <>
      <a className={styles.uploadAvatarLink} onClick={openFileInput}>{uploadAvatarText}</a>
      <input hidden name='picture' type='file' ref={fileInputRef} onChange={onFileChange} accept='.png, .jpeg, .jpg'/>
    </>
  )
}

const PictureViewer = (field) => {
  const value = field.input.value
  return value && <AvatarPreview src={typeof value === 'string' ? value : URL.createObjectURL(value)} />
}

export default class AvatarUpload extends React.PureComponent<Props, State> {
  state = {
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

  get uploadAvatarLinkText () {
    return (this.state.chosenFile ? 'Update' : 'Upload') + ' Profile Photo'
  }

  render () {
    return (
      <div className={styles.avatarUpload}>
        <div className={styles.avatarContainer}>
          {
            this.state.chosenFile ?
            <AvatarPreview src={this.state.chosenFile} />
            :
            <>
              <div className={styles.avatarPlaceholder}></div>
              <ReduxFormField
                name='picture'
                component={PictureViewer}
              />
            </>
          }
        </div>
        <UploadAvatarLink
          fileInputRef={this.fileInputRef}
          openFileInput={this.openFileInput}
          uploadAvatarText={this.uploadAvatarLinkText}
          onFileChange={this.fileChosen}
        />
      </div>
    )
  }
}
