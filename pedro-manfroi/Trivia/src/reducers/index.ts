/**
 * Root Reducer that holds all the registered reducers that are going to be utilized.
 */
import { combineReducers } from 'redux';
import SettingsReducer from './SettingsReducer';

const rootReducer = combineReducers({
    settings: SettingsReducer, 
});

export type ReduxState = ReturnType<typeof rootReducer>;
export default rootReducer;