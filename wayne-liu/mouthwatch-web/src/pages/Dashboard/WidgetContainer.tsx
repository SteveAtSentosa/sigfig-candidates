import * as React from 'react'
import { Heading7 as Heading } from '#/components/Heading'
const styles = require('./styles.scss')

interface Props {
  children: {
    title: string
    submenu?: React.ReactNode
    className: string
    widget: React.ReactNode
  }
}

export default class WidgetContainer extends React.Component<Props> {
  render () {
    const { title, submenu, className, widget } = this.props.children

    return (
      <div className={'widget ' + styles[className]}>
        <div className={styles.title}>
          <div><Heading className={styles.heading}>{title}</Heading></div>
          <div className={styles.submenu}>{ submenu ? submenu : null }</div>
        </div>
        <div className={styles.content}>
          { widget }
        </div>
      </div>
    )
  }
}
