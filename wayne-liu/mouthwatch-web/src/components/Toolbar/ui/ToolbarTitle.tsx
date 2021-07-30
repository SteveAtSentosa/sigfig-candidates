import * as React from 'react'

import { Heading4 as Heading } from '#/components/Heading'
import { ToolbarUIProps } from '../types'

const styles = require('./styles.scss')

const Title: React.FC<Pick<ToolbarUIProps, 'title'>> = ({ title }) => {

  if (!title) return null
  return (
    <>
      <Heading className={styles.title}>Capture Intraoral Imagery</Heading>
      <span className={styles.grow}></span>
    </>
  )
}

export default Title
