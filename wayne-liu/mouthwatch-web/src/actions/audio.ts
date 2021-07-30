import { EntityId } from '#/types'
import { defineAction } from 'redoodle'

// Actions

export const OpenAudioRecordingModal = defineAction('[audio] open modal')()
export const CloseAudioRecordingModal = defineAction('[audio] close modal')()
export const SaveAudioRecording = defineAction('[audio] save audio file')<EntityId>()
export const StashAudioRecording = defineAction('[audio] stash audio file')<File>()
