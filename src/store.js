import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import mapReducer from './reducers/mapReducer'
import userLocationReducer from './reducers/userLocationReducer'

const reducer = combineReducers({
  map: mapReducer,
  userLocation: userLocationReducer,
})

const store = createStore(
  reducer, composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store
