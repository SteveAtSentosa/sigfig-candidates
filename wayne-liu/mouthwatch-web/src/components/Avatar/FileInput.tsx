import * as React from 'react'

import Thumbnail from '#/components/Thumbnail'
import cn from 'classnames'

const styles = require('./styles.scss')

type ImageProps = {
  src: string
  className?: string
}

export const DisplayFileInputImage = ({ src, className }: ImageProps) => (
  <div className={cn(styles.avatar_image_wrapper, { [className]: className })}>
    <Thumbnail className={styles.avatar_image}>{src}</Thumbnail>
  </div>
)

type FileInputProps = {
  onSaveCb: (e) => void
  onCancel: () => void
}

export default class FileInput extends React.Component<FileInputProps> {
  fileInputRef = React.createRef<HTMLInputElement>()

  state = {
    chosenFile: null
  }

  chooseFile = () => {
    (this.fileInputRef as any).current.click()
  }

  fileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList: FileList = e.target.files
    const firstFile = fileList[0]
    const reader = new FileReader()
    reader.onload = (_e: ProgressEvent) => {
      this.setState({ chosenFile: reader.result })
    }
    reader.readAsDataURL(firstFile)
  }

  save = () => {
    this.props.onSaveCb(this.state.chosenFile)
  }

  _renderPreview = () => {
    return (
      <div>
        <div>
          <DisplayFileInputImage src={this.state.chosenFile} />
        </div>
        <button onClick={this.props.onCancel}>Cancel</button>
        <button onClick={this.chooseFile}>Choose Again</button>
        <button onClick={this.save}>Save</button>
      </div>
    )
  }

  render () {
    return (
      <div>
        {
          this.state.chosenFile ?
          this._renderPreview()
          :
          (
            <div>
              <button onClick={this.props.onCancel}>Cancel</button>
              <button onClick={this.chooseFile}>Choose File</button>
            </div>
          )
        }
        <input
          hidden
          type='file'
          name='picture'
          ref={this.fileInputRef}
          onChange={this.fileChosen}
          accept='.png, .jpeg, .jpg'
        />
      </div>
    )
  }
}
