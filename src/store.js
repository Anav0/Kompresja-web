import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const state = {};

const middleware = [thunk];

const store = createStore(rootReducer, state, applyMiddleware(...middleware));

export default store;