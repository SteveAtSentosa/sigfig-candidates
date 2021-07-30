import * as React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { slide as Menu } from 'react-burger-menu'
import cn from 'classnames'
import { faTimes } from '@fortawesome/pro-light-svg-icons'

const styles = require('./styles.scss')

interface Props {
  isOpen: boolean
  closeFunction: () => void
  title?: string
  titleClassName?: string
  menuClassName?: string
  menuChildClassName?: string
  menuWrapClassName?: string
  children: any
}

export default class SubMenu extends React.PureComponent<Props> {

  private get menuChildClassName () {
    const { menuChildClassName } = this.props
    return cn(styles.menuChild, {
      [menuChildClassName]: menuChildClassName
    })
  }

  private get menuWrapClassName () {
    const { menuWrapClassName } = this.props
    return cn(styles.menuWrap, {
      [menuWrapClassName]: menuWrapClassName
    })
  }

  private get menuClassName () {
    const { menuClassName } = this.props
    return cn(styles.menu, {
      [menuClassName]: menuClassName
    })
  }

  render () {
    const { isOpen, closeFunction, children, title, titleClassName } = this.props
    return (
      <Menu
        className={this.menuWrapClassName}
        customBurgerIcon={false}
        customCrossIcon={false}
        disableOverlayClick={closeFunction}
        isOpen={isOpen}
        itemClassName={styles.item}
        itemListClassName={styles.itemList}
        menuClassName={this.menuClassName}
        overlayClassName={styles.overlay}
        left
        width={380}
      >
        <div className={this.menuChildClassName}>
          {
            title &&
            <div className={styles.top} onClick={closeFunction}>
              <h3 className={titleClassName}>{title}</h3>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          }
          {children}
        </div>
      </Menu>
    )
  }
}
