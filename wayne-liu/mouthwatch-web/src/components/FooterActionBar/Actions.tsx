import * as React from 'react'

import { RouteComponentProps, withRouter } from 'react-router-dom'

import EssentialTooltip from '../EssentialTooltip'
import cn from 'classnames'

const styles = require('./styles.scss')

interface ActionProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  className?: string
}

export const Action = (props: ActionProps) => (
  <span className={cn(styles.action, props.className)}>
    <button onClick={props.onClick}>
      <span className={styles.icon}>
        {props.icon}
      </span>
      <span className={styles.label}>
        {props.label}
      </span>
    </button>
  </span>
)

export interface AudioActionProps extends RouteComponentProps {
  url: string
  hasPermission: boolean
}

const AudioAction: React.FC<AudioActionProps> = ({ url, history, hasPermission }) => {
  return(
    <Action
      className={!hasPermission ? styles.upgradeOnly : ''}
      icon={
        <span className={styles.audioIcon}>
          <img src='/static/images/icon_footer_audio.png'/>
        </span>}
      label='Audio'
      onClick={() => history.push(url)}
    />
  )
}

export const Audio = withRouter((props: AudioActionProps) => {
  const { hasPermission } = props
  return (
    <>
      { hasPermission ?
        <AudioAction {...props} /> :
        <EssentialTooltip
          content={<span><strong>Record audio notes</strong> to more easily add thoughts and observations to patient records.</span>}
        >
          <AudioAction {...props} />
        </EssentialTooltip>
      }
    </>
  )
})

export const Chat = () => (
  <Action
    icon={
      <span className={styles.chatIcon}>
        <img src='/static/images/icon_footer_chat.png'/>
      </span>}
    label='Chat'
    onClick={() => alert('Chat action')}
  />
)

export const Video = withRouter((props: RouteComponentProps) => (
  <Action
    icon={
      <span className={styles.videoIcon}>
        <img src='/static/images/icon_footer_video.png'/>
      </span>}
    label='Video'
    onClick={() => props.history.push('/video')}
  />
))

export const defaultActions = [
  <Video/>
]
