import { all, takeLatest } from 'redux-saga/effects'

import { SaveAudioRecording } from '#/actions/audio'

export function* saveAudioRecording (_action: ReturnType<typeof SaveAudioRecording>) {
  /* Save File to account here */
}

export function* saga () {
  yield all([
    takeLatest(SaveAudioRecording.TYPE, saveAudioRecording)
  ])
}
