import { Reducer, applyMiddleware, compose, createStore } from 'redux'
import { initialState, reducers } from './reducers'
import { persistReducer, persistStore } from 'redux-persist'

import createSagaMiddleware from 'redux-saga'
import { getEnv } from '#/config'
import localforage from 'localforage'
import { reduceCompoundActions } from 'redoodle'
import rootSaga from './sagas'

function configureReducer<S> (rootReducer: Reducer<S>): Reducer<S> {
  return persistReducer(
    {
      key: 'root',
      version: 0,
      storage: localforage,
      whitelist: [ 'auth' ]
    },
    reduceCompoundActions(rootReducer)
  )
}

const composeEnhancers = getEnv() !== 'prod' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const sagaMiddleware = createSagaMiddleware()

const configuredReducer = configureReducer(reducers)

export const store = createStore(
  configuredReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(sagaMiddleware)
  )
)

// start sagas
;(store as any).sagaTask = sagaMiddleware.run(rootSaga)

// redux persistence to local storage
export const persister = persistStore(store)

// support hot module replacement
if ((module as any).hot) {
  (module as any).hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers')
    store.replaceReducer(nextRootReducer)
  })
}

export default store
