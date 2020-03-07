import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import rootReducer from './services/redux/reducers'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { ParallaxProvider } from 'react-scroll-parallax'
import { BrowserRouter as Router } from "react-router-dom";
import thunk from 'redux-thunk'
// Export the store so we have it available in the services API.
export const store = createStore(rootReducer, applyMiddleware(thunk))
// Renders the event block application if the element is on the page
if (document.getElementById('grandera-application') !== null) {
  ReactDOM.render(
    <Provider store={store}>
      <ParallaxProvider>
        <Router>
          <App />
        </Router>
      </ParallaxProvider>
    </Provider>,
    document.getElementById('grandera-application')
  )
}
