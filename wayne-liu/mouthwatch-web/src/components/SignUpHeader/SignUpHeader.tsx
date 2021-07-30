import React from 'react'

const styles = require('./styles.scss')

const SignUpHeader: React.FC<{}> = () => {

  return (
    <div className={styles.siteHeader}>
      <a href='/' className={styles.logoLink}>
        <span className={styles.logo}>
          <img
            src='/static/images/logo_horizontal_2020@3x.png'
            srcSet='/static/images/logo_horizontal_2020@1x.png 1x, /static/images/logo_horizontal_2020@2x.png 2x, /static/images/logo_horizontal_2020@3x.png 3x'
          />
        </span>
      </a>
    </div>
  )
}

export default SignUpHeader
