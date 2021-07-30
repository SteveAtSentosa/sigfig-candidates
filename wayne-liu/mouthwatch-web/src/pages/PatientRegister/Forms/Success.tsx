import * as React from 'react'

import Button, { SocialButton } from '#/components/Button'

import HorizontalRule from '#/components/HorizontalRule'
import config from '#/config'

const styles = require('./styles.scss')

const Success: React.FunctionComponent = (_props) => {

  return (
    <div className={styles.register}>
      <h2>Success!</h2>
      <div className={styles.success}>
        <p>
          Your account is all set. Click below to proceed to
          the portal.
        </p>
        <Button>Proceed to Portal</Button>
      </div>
      {
        config.features.socialLogin &&
        <>
        <HorizontalRule width='78%'/>
        <p className={styles.linkAccounts}>
          If  you'd like, you can link your social media
          account for quicker login later.
        </p>
        <div className={styles.socialBtns}>
          <SocialButton type='facebook'/>
          <SocialButton type='google'/>
        </div>
        </>
      }
    </div>
  )
}

export default Success
