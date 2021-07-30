/**
 * List of available action types.
 */
import { SettingsData } from '../components/settings/types';

interface ReduxAction<Name extends string, Payload = unknown> {
    type: Name
    payload: Payload extends object ? Payload : undefined
 }

export enum SettingsActionTypes {
    loadSettings = 'Settings.load',
    saveSettings= 'Settings.save',
}

export type LoadSettings = ReduxAction<SettingsActionTypes.loadSettings>
export type SaveSettings = ReduxAction<SettingsActionTypes.saveSettings, {settings: SettingsData}>

// All available actions
export type SettingsActions = LoadSettings | SaveSettings
