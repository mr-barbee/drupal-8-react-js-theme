import React, {Component} from 'react'
import ClassNames from 'classnames'
import {
  Link,
  NavLink,
  withRouter,
  matchPath
} from "react-router-dom";

const NavbarToHide = (props) => {
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
  // Else just return the navbar.
  return <Navbar {...props} />
}

class Navbar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      menuItems: drupalSettings.menuItems.src
    }
    // bind this to the event handler
    this.isActive = this.isActive.bind(this)
  }

  // Match the first part of the url with the menu item.
  isActive = url => this.props.location.pathname.split('/')[1] == url.split('/')[1]

  render () {
    return (
      <div className='container'>
        <nav>
          <div className='logoImageContainers'>
            <Link to='/'><img className='logoImage' src={drupalSettings.logo.url.src} /></Link>
          </div>
          <div className='menu'>
            <ul className='primary-nav with-indicator'>
              {this.state.menuItems.map((menuItem, key) => {
                let classes = ClassNames({
                  'nav-item': true,
                  'active': this.isActive(menuItem.url),
                })
                return (
                  <li className={classes} key={key}>
                    <NavLink key={key} to={menuItem.url}>{menuItem.title}</NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default withRouter(NavbarToHide);
