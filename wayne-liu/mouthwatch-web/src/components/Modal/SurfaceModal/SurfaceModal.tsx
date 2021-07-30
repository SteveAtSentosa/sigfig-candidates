import * as Modal from '#/components/Modal'
import * as React from 'react'

import Button from '#/components/Button'
import { Heading4 } from '#/components/Heading'
import Surface from './Surface'
import isEqual from 'lodash/isEqual'
import values from 'lodash/values'
import without from 'lodash/without'
import { pick } from 'lodash'

interface Props {
  isOpen: boolean
  close: () => void
  initialValues: Array<{ label: string, value: string }>
  handleSubmit: (values: any) => void
}

interface State {
  workingSelection: string[]
  topLevelSurface: string
}

export default class SurfaceModal extends React.Component<Props, State> {
  state = {
    workingSelection: [],
    topLevelSurface: ''
  }

  get initialSurfaces () {
    return this.props.initialValues.map(({ value }) => value)
  }

  handleTopLevelSelectors = (surfaces: { surfaceRight: string, surfaceLeft: string }) => {
    const topLevelSurface = values(surfaces).find(v => !!(v.length))
    this.setState({ topLevelSurface })
  }

  handleSubmit = () => {
    const { workingSelection, topLevelSurface } = this.state
    const { handleSubmit } = this.props
    const selection = (!workingSelection.includes(topLevelSurface) && topLevelSurface.length > 0) ? workingSelection.concat(topLevelSurface) : workingSelection
    this.setState({ topLevelSurface: '' }, () => handleSubmit(selection))
  }

  isSelected = (surface: string) => {
    return this.state.workingSelection.includes(surface)
  }

  addSurface = (surface: string) => {
    const currentSelection = this.state.workingSelection
    currentSelection.push(surface)
    this.setState({ workingSelection: currentSelection })
  }

  removeSurface = (surface: string) => {
    const workingSelectionMinusSurface = without(this.state.workingSelection, surface)
    this.setState({ workingSelection: workingSelectionMinusSurface })
  }

  handleSurfaceClick = (surface: string) => {
    if (this.isSelected(surface)) {
      this.removeSurface(surface)
    } else {
      this.addSurface(surface)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const prevInitialValues = prevProps.initialValues.map(({ value }) => value)
    const currentInitialValues = this.props.initialValues.map(({ value }) => value)
    if ((!prevState.workingSelection.length && this.initialSurfaces.length) || !isEqual(prevInitialValues, currentInitialValues)) {
      this.setState({ workingSelection: this.initialSurfaces })
    }
  }

  render () {
    const { close, ...modalProps } = this.props
    return (
      <Modal.Wrapper
        onHide={close}
        backdrop
        keyboard
        {...pick(modalProps, Modal.keysOfBaseModalProps)}
      >
        <Modal.Header>
          <Heading4>Surface</Heading4>
        </Modal.Header>
        <Modal.Body>
          <Surface onTopLevelSelectors={this.handleTopLevelSelectors} handleSurfaceClick={this.handleSurfaceClick} selected={this.state.workingSelection} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close} secondary>Cancel</Button>
          <Button onClick={this.handleSubmit}>Add Surface</Button>
        </Modal.Footer>
      </Modal.Wrapper>
    )
  }
}
