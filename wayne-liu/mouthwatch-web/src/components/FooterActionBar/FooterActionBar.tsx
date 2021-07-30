import * as React from 'react'

import { defaultActions } from './Actions'

const styles = require('./styles.scss')

interface Props {
  actions: React.ReactNode[]
}

export const FooterActionBar = (props: Props) => {
  return (
    <div className={styles.actionBar}>
      {props.actions.map((action, i) =>
        <span key={i}>
          {action}
        </span>
      )}
    </div>
  )
}

export interface ActionBarConfig {
  actions: React.ReactNode[]
}

export type ConfigureFooterActionBar = () => ActionBarConfig

/**
 * Footer action bar decorator
 */
export function withFooterActionBar () {
  return function<T extends Function> (BaseComponent: T): T {
    return class extends (BaseComponent as any) {

      get actionBarConfig (): ActionBarConfig {
        if (this.configureFooterActionBar) {
          return this.configureFooterActionBar()
        } else {
          return {
            actions: defaultActions
          }
        }
      }

      render () {
        const actions = this.actionBarConfig.actions

        return (
          <>
            {super.render()}
            <FooterActionBar actions={actions}/>
          </>
        )
      }

    } as any
  }
}
