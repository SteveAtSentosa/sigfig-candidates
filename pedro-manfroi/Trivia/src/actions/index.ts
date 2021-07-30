/**
 * Implementation of the Redux actions.
 */
import { LoadSettings, SaveSettings, SettingsActionTypes} from './types';
import { SettingsData} from '../components/settings/types';

export const SettingsActions = {
    
    loadSettings: (): LoadSettings => ({
        type: SettingsActionTypes.loadSettings,
        payload: undefined, // There is no payload when loading settings
    }),

    saveSettings: (settings: SettingsData): SaveSettings => ({
      type: SettingsActionTypes.saveSettings,
      payload: {settings},
    }),

}  