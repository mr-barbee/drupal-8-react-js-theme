import React, {Component} from 'react'
import Navbar from './components/Navigation/Navbar'
import Footer from './components/Navigation/Footer'
import VideoScreen from './scenes/VideoScreen'
import Music from './scenes/Music'
import About from './scenes/About'
import Store from './scenes/Store'
import Checkout from './scenes/Checkout'
import Maintenance from './scenes/Maintenance'
import {
  BrowserRouter as Router,
  Switch,
  Route } from "react-router-dom";

const AppToHide = () => {
  // Maintenance if maintenance mode is set.
  if (drupalSettings.maintenanceMode == true){
    return <Maintenance />
  }
  // Else just return
  // the default App.
  return <App />
}

class App extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Router>
        <Navbar />
        <div className="main-content">
          <Switch>
            <Route exact path="/">
              <VideoScreen />
            </Route>
            <Route exact path="/music">
              <Music />
            </Route>
            <Route path="/store">
              <Store />
            </Route>
            <Route path="/checkout">
              <Checkout />
            </Route>
            <Route exact path="/about">
              <About />
            </Route>
          </Switch>
        </div>
        <Footer />
      </Router>
    )
  }
}

export default AppToHide
