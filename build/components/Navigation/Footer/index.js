import React, {Component} from 'react'
import SubscriptionForm from './components/SubscriptionForm'
import {
  Link,
  withRouter,
  matchPath
} from "react-router-dom";

const FooterToHide = (props) => {
  const { location } = props;
  const match = matchPath(location.pathname, {
      path: '/',
      exact: true,
      strict: false
    });
  // return null if we are
  // on the homepage.
  if (match != null){
    return null;
  }
  // Else just return the footer.
  return <Footer />
}

class Footer extends Component {
  constructor (props) {
    super(props)
    this.state = { }
  }

  getCurrentDate () {
    return (new Date().getFullYear())
  }

  render () {
    return (
      <div className='container'>
        <footer>
          <div className='row'>
            <div className='col-md-7'>
              <ul>
                <li><SubscriptionForm /></li>
                <li>&copy; {(new Date().getFullYear())} <Link to="/">{drupalSettings.logo.name.src}</Link></li>
              </ul>
            </div>
            <div className='col-md-5'>
              <img className='footerImage' src={drupalSettings.footerImage.src} />
            </div>
          </div>
        </footer>
      </div>
    )
  }
}

export default withRouter(FooterToHide);
