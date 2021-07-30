import { defineAction } from 'redoodle'
// Types
export type CaptureType = 'import' | 'photo' | 'video'

export type FacingMode = 'user' | 'environment'
export type DeviceType = 'mobile' | 'desktop' | 'unset'
export type VideoMode = 'liveFeed' | 'recordedPreview'

export type CapturedMedia = File[]
// Actions
export const SetCaptureType = defineAction('[camera] set capture type ')<CaptureType>()
export const SetFacingMode = defineAction('[camera] set facing mode')<FacingMode>()
export const CaptureCameraMedia = defineAction('[camera] capture media')<File>()
export const SetRecording = defineAction('[camera] set recording')<boolean>()
export const CreateMediaRecorder = defineAction('[camera] create media recorder')()
export const SetInitialTimeStamp = defineAction('[camera] set initial timestamp')<string>()
export const SetAvailableDevices = defineAction('[camera] set available devices')<ConstrainDOMString[] | ConstrainDOMString>()
export const SetVideoMode = defineAction('[camera] set video mode')<VideoMode>()
export const SetDeviceType = defineAction('[camera] set device type')<DeviceType>()
export const SetVideoFile = defineAction('[camera] set video file')<File>()
export const Reset = defineAction('[camera] reset')()
