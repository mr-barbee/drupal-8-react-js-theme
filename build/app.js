import React, {Component} from 'react'
import Navbar from './components/Navigation/Navbar'
import Footer from './components/Navigation/Footer'
import VideoScreen from './scenes/VideoScreen'
import Music from './scenes/Music'
import About from './scenes/About'
import Store from './scenes/Store'
import Checkout from './scenes/Checkout'
import Maintenance from './scenes/Maintenance'
import GoogleAnalytics from './services/GoogleAnalytics'
import {
  withRouter,
  Switch,
  Route } from "react-router-dom";

const AppToHide = (props) => {
  // Maintenance if maintenance mode is set.
  if (drupalSettings.maintenanceMode == true){
    return <Maintenance absolutePostition={false} />
  }
  // Else just return
  // the default App.
  return <App {...props} />
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      analytics: new GoogleAnalytics()
    }
    this.onRouteChanged = this.onRouteChanged.bind(this)
  }

  componentDidMount() {
    this.state.analytics.trackPageView()
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    // Track the page view.
    this.state.analytics.trackPageView()
  }

  render () {
    return (
      <div>
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
      </div>
    )
  }
}

export default withRouter(AppToHide)
