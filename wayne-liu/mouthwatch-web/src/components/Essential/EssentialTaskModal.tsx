import * as React from 'react'

import { EssentialModal, UpgradeSubscriptionContainer } from '#/components/EssentialModal'

const EssentialTaskModal: React.FC = () => {
  return (
    <UpgradeSubscriptionContainer>
      <EssentialModal
        image={'/static/images/essentialModal/tasks.png'}
        title={
          <div>
            Manage Tasks and Workflow Better with
            <br /> <strong>TeleDent Professional</strong>
          </div>
        }
        description={'Upgrade to Professional to utilize task management and other key features that improve team communication and collaboration.'}
        copy={['Quickly Assign Tasks', 'Manage Workflow', 'Streamline Care']}
      />
    </UpgradeSubscriptionContainer>
  )
}

export default EssentialTaskModal
