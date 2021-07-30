import * as React from 'react'

import { EssentialModal, UpgradeSubscriptionContainer } from '#/components/EssentialModal'

import AddProcedure from '#/components/AddProcedure'

const EssentialPosting: React.FC = () => {
  return (
    <div style={{ position: 'relative', height: '75%' }}>
      <AddProcedure initialValues={{ status: 'Proposed' }}/>
      <UpgradeSubscriptionContainer>
        <EssentialModal
          image={'/static/images/essentialModal/codes.png'}
          title={
            <div>
              Capture and Record CDT Codes with
              <br /> <strong>TeleDent Professional</strong>
            </div>
          }
          description={'Upgrade to Professional to add procedures and associated fees to a patient record.'}
          copy={['Improve Billing', 'Set Procedure Status', 'Capture Teledentistry Codes']}
        />
      </UpgradeSubscriptionContainer>
    </div>
  )
}

export default EssentialPosting
