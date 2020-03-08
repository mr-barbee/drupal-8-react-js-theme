import React, { Component } from 'react'
import {
  Switch,
  Route,
  withRouter } from "react-router-dom";
  import Maintenance from './../Maintenance'
import ProductList from './components/ProductList'
import ProductView from './components/ProductView'

const StoreToHide = props => {
  // Maintenance if maintenance mode is set.
  if (drupalSettings.disableStore == true){
    return <Maintenance absolutePostition={true} />
  }
  // Else just return
  // the default Store.
  return <Store {...props} />
}

class Store extends Component {
  render () {
    return (
      <div className='store-page'>
        <Switch>
          <Route exact path={this.props.match.path} exact component={ ProductList } />
          <Route path={`${this.props.match.path}/product/:productId`} component={ ProductView } />
        </Switch>
      </div>
    )
  }
}

export default withRouter(StoreToHide)
