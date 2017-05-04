import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import rootReducer from '../app/rootReducer';

const logger = createLogger();

const store = preloadedState => createStore(
  rootReducer,
  preloadedState = {},
  applyMiddleware(thunk,logger)
)

export default store();