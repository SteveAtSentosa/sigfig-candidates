import * as Modal from '#/components/Modal'
import * as React from 'react'

import { isEqual, without, pick } from 'lodash'

import Button from '#/components/Button'
import { Heading4 } from '#/components/Heading'
import ToothNumber from './ToothNumber'

const styles = require('./styles.scss')

interface Props {
  isOpen: boolean
  close: () => void
  initialValues: Array<{ label: string, value: string }>
  handleSubmit: (values: any) => any
}

interface State {
  workingSelection: string[]
}

export default class ToothModal extends React.Component<Props, State> {
  constructor (props) {
    super(props)
    this.state = {
      workingSelection: this.initialToothNums
    }
  }
  get initialToothNums () {
    return this.props.initialValues.map(v => v.value)
  }

  handleSubmit = () => {
    this.props.handleSubmit(this.state.workingSelection)
  }

  isSelected = (toothNum: string) => {
    return this.state.workingSelection.includes(toothNum)
  }

  addTooth = (tooth: string) => {
    const currentSelection = this.state.workingSelection
    currentSelection.push(tooth)
    this.setState({ workingSelection: currentSelection })
  }

  removeTooth = (tooth: string) => {
    const workingSelectionMinusTooth = without(this.state.workingSelection, tooth)
    this.setState({ workingSelection: workingSelectionMinusTooth })
  }

  handleToothClick = (tooth: string) => {
    if (this.isSelected(tooth)) {
      this.removeTooth(tooth)
    } else {
      this.addTooth(tooth)
    }
  }

  clearWhatsBeenAdded = () => {
    this.setState({ workingSelection: this.initialToothNums })
    this.props.close()
  }

  componentDidUpdate (prevProps: Props, prevState: State) {
    const prevInitialValues = prevProps.initialValues.map(v => v.value)
    const currentInitialValues = this.props.initialValues.map(v => v.value)
    if ((!prevState.workingSelection.length && this.initialToothNums.length) || !isEqual(prevInitialValues, currentInitialValues)) {
      this.setState({ workingSelection: this.initialToothNums })
    }
  }

  render () {
    const { close, ...modalProps } = this.props
    return (
      <Modal.Wrapper
        onHide={this.clearWhatsBeenAdded}
        backdrop
        keyboard
        className={styles.wrapper}
        {...pick(modalProps, Modal.keysOfBaseModalProps)}
      >
        <Modal.Header>
          <Heading4>Tooth Number</Heading4>
        </Modal.Header>
        <Modal.Body className={styles.tooth_modal_body}>
          <ToothNumber handleToothClick={this.handleToothClick} selected={this.state.workingSelection} />
        </Modal.Body>
        <Modal.Footer className={styles.tooth_modal_footer}>
          <div>
            <Button className={styles.button} onClick={this.clearWhatsBeenAdded} secondary>Cancel</Button>
            <Button className={styles.button} onClick={this.handleSubmit}>Done</Button>
          </div>
        </Modal.Footer>
      </Modal.Wrapper>
    )

  }
}
