import * as Modal from '#/components/Modal'
import * as React from 'react'

import Button from '#/components/Button'
import { GroupConsentPolicy } from '#/types'

const styles = require('./styles.scss')

interface Props {
  consentPolicies: GroupConsentPolicy[]
  isOpen: boolean
  close?: () => void
  agree: () => void
}

interface State {
  activePolicyIndex: number
}

class GroupConsentPolicyModal extends React.PureComponent<Props, State> {
  state = {
    activePolicyIndex: 0
  }

  handlePolicySelect = (e: React.MouseEvent<HTMLAnchorElement>, i: number) => {
    e.preventDefault()
    this.setState({ activePolicyIndex: i })
  }

  render () {
    const { close, agree, consentPolicies, ...modalProps } = this.props
    const policy = consentPolicies[this.state.activePolicyIndex]
    if (!policy) return null

    return (
      <>
        <Modal.Wrapper
          size='lg'
          keyboard
          backdrop
          onRequestClose={close}
          {...modalProps}
        >
          <Modal.Header>
            <div><b>Consent Policy</b></div>
          </Modal.Header>
          <Modal.Body className={styles.groupConsentPolicyModalBody}>
            <div>
              {
                consentPolicies.map((p, i) =>
                  <a key={p.language} href='#' onClick={(e) => this.handlePolicySelect(e, i)} className={`${styles.filterByLang} ${this.state.activePolicyIndex === i ? styles.selected : ''}`}>
                    {p.language}
                  </a>
                )
              }
            </div>
            <div className={styles.modalContentContainer} dangerouslySetInnerHTML={{ __html: policy.consent_policy }} />
          </Modal.Body>
          <Modal.Footer>
            {
              close &&
                <Button skinnyBtn secondary onClick={close}>{policy.decline_button_text}</Button>
            }
            <Button skinnyBtn onClick={agree}>{policy.agree_button_text}</Button>
          </Modal.Footer>
        </Modal.Wrapper>
      </>
    )
  }
}

export default GroupConsentPolicyModal
