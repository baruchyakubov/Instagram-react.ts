import { applyMiddleware, combineReducers, compose, legacy_createStore as createStore } from 'redux'
import thunk from 'redux-thunk'
import { storyReducer } from './reducers/story.reducer'
import { userReducer } from './reducers/user.reducer'
export type AppDispatch = typeof store.dispatch

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const rootReducer = combineReducers({
    storyModule: storyReducer,
    userModule: userReducer

})

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))