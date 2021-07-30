/**
 * Reducer for the Settings management.
 */
import { SettingsActions, SettingsActionTypes } from '../actions/types';
import { SettingsData } from '../components/settings/types';
import { OpenTriviaDBDifficulty, OpenTriviaDBDCategory } from '../utils/APIUtils';

const INITIAL_STATE: SettingsData = {
    numOfQuestions: 10,
    difficulty: OpenTriviaDBDifficulty.HARD,
    category: OpenTriviaDBDCategory.ANY,
}

export default function(state: SettingsData, action: SettingsActions) {
    switch (action.type) {
        case SettingsActionTypes.loadSettings:            
            if (!state) {  
                // If it's not loaded, return its initial value
                return INITIAL_STATE;
            }
            // Return current state if it is already loaded
            return state;
        case SettingsActionTypes.saveSettings: 
            return action.payload.settings;
        default:
            // If state is not set, force returning null instead of undefined (this is a specific setting for Redux library)
            return state ? state : null;
    }
}