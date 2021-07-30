import * as React from 'react'

import { DefaultProps, Props } from './types'
import Icon, { Size } from '#/components/Icon'

import Button from '#/components/Button'
import { Heading6 } from '#/components/Heading'
import { slide as Menu } from 'react-burger-menu'

const styles = require('./styles.scss')

export default class SlideOutMenu extends React.PureComponent<Props> {
  static defaultProps: DefaultProps = {
    actionButtonCallback: () => { /* no-op */ },
    actionButtonText: null,
    alignRight: false,
    className: styles['bm-menu-wrap'],
    itemClassName: styles['bm-item'],
    itemListClassName: styles['bm-item-list'] ,
    menuClassName: styles['bm-menu'],
    overlayClassName: styles['bm-overlay'],
    closeMenu: null,
    isOpen: null,
    saveOnExit: false,
    disableOverlayClick: false
  }

  private get closeMenu () {
    return this.props.closeMenu || this.props._closeSideMenu
  }

  private get isOpen () {
    return this.props.isOpen || this.props._isOpen
  }

  render () {
    const {
      title,
      actionButtonText, actionButtonCallback,
      className, overlayClassName,
      itemListClassName, menuClassName,
      itemClassName, alignRight, disableOverlayClick
    } = this.props

    return (
        <Menu
          right={alignRight}
          width='35vw'
          isOpen={this.isOpen}
          customBurgerIcon={false}
          customCrossIcon={false}
          className={className}
          itemClassName={itemClassName}
          itemListClassName={itemListClassName}
          menuClassName={menuClassName}
          overlayClassName={overlayClassName}
          disableOverlayClick={disableOverlayClick}
        >
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className={styles['bm-top-section']} onClick={this.closeMenu}>
              <div className={styles.collected_images}>
                <Heading6>{title}</Heading6>
              </div>
              <Icon name={'clear'} size={Size.Medium} />
            </div>
            <div className={styles['bm-middle-section']}>
              {this.props.children}
            </div>
            <div className={styles['bm-bottom-section']}>
              <Button onClick={actionButtonCallback}>{actionButtonText}</Button>
            </div>
          </div>
        </Menu>
    )
  }

}
